from django.core.serializers import serialize
from django.db.models import Avg, Count, Q
from django.shortcuts import get_object_or_404
from rest_framework.generics import RetrieveAPIView, ListCreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework import status, generics, viewsets, permissions
from django.utils.text import slugify
from unidecode import unidecode

from .models import Cart, CartItem, Product, Category, Order, OrderItem, Review
from .serializers import ProductSerializer, CartItemSerializer, CategorySerializer, OrderCreateSerializer, \
    OrderListSerializer, OrderDetailSerializer, ReviewSerializer, TopProductSerializer


class ListProductAPIView(generics.ListAPIView):
    queryset = Product.objects.filter(in_active=True)
    serializer_class = ProductSerializer


class ListCategoryAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CartViewSet(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        items = CartItem.objects.filter(cart=cart)
        serializer = CartItemSerializer(items, many=True)
        return Response(serializer.data)


class CartSyncView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data
        cart, new_cart = Cart.objects.get_or_create(user=user)

        if not isinstance(data, list):
            return Response(
                {"error": "Expected list"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Текущие элементы корзины пользователя
        existing = {ci.product_id: ci for ci in CartItem.objects.filter(cart=cart)}

        incoming_ids = set()

        for item in data:
            product_id = item.get("product_id")
            quantity = item.get("quantity", 1)

            if not product_id:
                continue

            incoming_ids.add(product_id)

            if product_id in existing:
                # Обновляем количество
                ci = existing[product_id]
                if ci.quantity != quantity:
                    ci.quantity = quantity
                    ci.save()
            else:
                # Создаём новую позицию
                try:
                    product = Product.objects.get(id=product_id)
                except Product.DoesNotExist:
                    continue

                CartItem.objects.create(
                    cart=cart,
                    product=product,
                    quantity=quantity
                )

        # Удаляем то, чего больше нет в корзине
        CartItem.objects.filter(cart=cart).exclude(product_id__in=incoming_ids).delete()

        return Response({"status": "ok"})


class ProductSearchView(APIView):
    def get(self, request):
        q = request.query_params.get("q", "").strip()
        categories = request.query_params.getlist("category")

        products = Product.objects.all()

        #  Поиск по тексту
        if q:
            products = products.filter(
                Q(name__icontains=q) |
                Q(description__icontains=q)
            )

        #  Фильтрация по категориям
        if categories:
            products = products.filter(category__slug__in=categories)

        products = products.distinct()[:20]

        serializer = ProductSerializer(
            products,
            many=True,
            context={"request": request}
        )
        return Response(serializer.data)


class CartMergeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        cart, _ = Cart.objects.get_or_create(user=user)

        for item in request.data:
            product_id = item.get("product_id")
            qty = item.get("quantity", 1)

            if not product_id:
                continue

            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product_id=product_id,
                defaults={"quantity": qty},
            )

            if not created:
                cart_item.quantity += qty
                cart_item.save()

        return Response({"status": "merged"})

class OrderCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user if request.user.is_authenticated else None

        # получаем корзину
        if user:
            cart = Cart.objects.filter(user=user).first()
            cart_items = CartItem.objects.filter(cart=cart)
        else:
            cart_items = request.data.get("items", [])

        if not cart_items:
            return Response(
                {"error": "Корзина пуста"},
                status=400
            )

        total = 0
        order = Order.objects.create(
            user=user,
            first_name=serializer.validated_data["first_name"],
            last_name=serializer.validated_data["last_name"],
            email=serializer.validated_data["email"],
            phone=serializer.validated_data["phone"],
            address=serializer.validated_data["address"],
            total_price=0,
        )

        for item in cart_items:
            product = item.product if user else Product.objects.get(id=item["product_id"])
            qty = item.quantity if user else item["quantity"]

            total += product.price * qty

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=qty,
                price=product.price,
            )

        order.total_price = total
        order.save()

        # очищаем корзину
        if user:
            CartItem.objects.filter(cart=cart).delete()

        return Response({"order_id": order.id})

class MyOrdersAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(
            user=request.user
        ).order_by("-created_at")

        return Response(
            OrderListSerializer(orders, many=True).data
        )

class MyOrderDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        order = get_object_or_404(
            Order,
            id=order_id,
            user=request.user
        )
        return Response(
            OrderDetailSerializer(order).data
        )

class ProductDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        product = get_object_or_404(Product, slug=slug)
        print(product.image)
        return Response(
            ProductSerializer(product, context={'request': request}).data
        )

class ProductReviewAPIView(ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        product = Product.objects.get(slug=self.kwargs["slug"])
        return Review.objects.filter(product=product)

    def perform_create(self, serializer):
        product = Product.objects.get(slug=self.kwargs["slug"])
        serializer.save(
            product=product,
            user=self.request.user
        )

class TopProductsAPIView(APIView):
    def get(self, request):
        products = Product.objects.all()
        # сортировка: рейтинг, потом количество отзывов
        products = sorted(
            products,
            key=lambda p: (
                -p.reviews.aggregate(avg_rating=Avg('rating'))['avg_rating'] if p.reviews.exists() else 0,
                -p.reviews.count()
            )
        )[:4]  # топ-4
        serializer = TopProductSerializer(products, many=True,context={'request':request})
        return Response(serializer.data)
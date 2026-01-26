from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status, generics, viewsets, permissions
from django.utils.text import slugify
from unidecode import unidecode

from .models import Cart, CartItem, Product, Category, Order, OrderItem
from .serializers import ProductSerializer, CartItemSerializer, CategorySerializer, OrderCreateSerializer


class ListProductAPIView(generics.ListAPIView):
    queryset = Product.objects.filter(in_active=True)
    serializer_class = ProductSerializer


class ListCategoryAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        cart = Cart.objects.get(user=self.request.user)
        return CartItem.objects.filter(cart=cart)

    def perform_create(self, serializer):
        cart = Cart.objects.create(user=self.request.user)
        serializer.save(cart=cart)

    def perform_update(self, serializer):
        cart = Cart.objects.get(user=self.request.user)
        serializer.save(cart=cart)


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
        q = request.query_params.get("q", "")
        products = Product.objects.filter(name__icontains=q)[:10]
        serializer = ProductSerializer(products, many=True, context={'request': request})
        print(serializer.data)
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

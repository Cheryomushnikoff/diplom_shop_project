from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, generics, viewsets, permissions
from django.utils.text import slugify
from unidecode import unidecode

from .models import Cart, CartItem, Product
from .serializers import ProductSerializer, CartItemSerializer

class ListProductAPIView(generics.ListAPIView):
    queryset = Product.objects.filter(in_active=True)
    serializer_class = ProductSerializer

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
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
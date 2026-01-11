from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Cart, CartItem, Product

def get_cart(request):
    # Если пользователь аутентифицирован
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return cart

    # Гость
    if not request.session.session_key:
        request.session.create()

    cart, _ = Cart.objects.get_or_create(
        session_key=request.session.session_key,
        user=None
    )

    return cart


class AddToCartView(APIView):
    def post(self, request):
        product_id = request.data.get("product_id")

        if not product_id:
            return Response(
                {'error': 'product_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        cart = get_cart(request)

        item, item_new = CartItem.objects.get_or_create(product=product)

        if not item_new:
            item.quantity += 1

        item.save()

        return Response({"ok": True})
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from store.models import Order
from .models import Payment
from .services.yookassa_s import create_yookassa_payment

class CreateYooKassaPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        order = Order.objects.get(id=order_id, user=request.user)

        payment, created = Payment.objects.get_or_create(
            order=order,
            provider="yookassa",
            defaults={"amount": order.total_price}
        )

        if payment.status == "paid":
            return Response({"detail": "Заказ уже оплачен"}, status=400)

        yk_payment = create_yookassa_payment(order)
        payment.payment_id = yk_payment.id
        payment.save()

        return Response({"payment_url": yk_payment.confirmation.confirmation_url})

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from store.models import Order
from .models import Payment
from .services import create_yookassa_payment, create_refund


class CreateYooKassaPaymentView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, order_id):
        user = request.user if request.user.is_authenticated else None
        order = Order.objects.get(id=order_id, user=user)

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


class UserRefundAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, order_id):
        payment = get_object_or_404(
            Payment,
            order_id=order_id,
        )

        if payment.status != "paid":
            return Response(
                {"detail": "Платёж не подтверждён"},
                status=status.HTTP_400_BAD_REQUEST
            )

        create_refund(payment)

        return Response({"detail": "Запрос на возврат отправлен"})

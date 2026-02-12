import json
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Payment

from store.services.order_status import mark_order_paid  # создаём функцию, которая меняет статус заказа на paid

@csrf_exempt
def yookassa_webhook(request):
    event = json.loads(request.body)

    if event.get("event") == "payment.succeeded":
        payment_id = event["object"]["id"]

        try:
            payment = Payment.objects.get(payment_id=payment_id)
        except Payment.DoesNotExist:
            return HttpResponse(status=404)

        payment.status = "paid"
        payment.save()

        mark_order_paid(payment.order)  # помечаем заказ как оплаченный

    elif event.get("event") == "refund.succeeded":
        payment_id = event["object"]["payment_id"]


        payment = Payment.objects.get(payment_id=payment_id)
        order = payment.order

        payment.status = "refunded"
        payment.save()

        order.status = "refunded"
        order.save()

    return HttpResponse(status=200)


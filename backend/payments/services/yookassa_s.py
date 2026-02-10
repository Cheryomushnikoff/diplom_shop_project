from yookassa import Configuration, Payment
from django.conf import settings
import uuid

Configuration.account_id = settings.YOOKASSA_SHOP_ID
Configuration.secret_key = settings.YOOKASSA_SECRET_KEY

# Если включён тестовый режим
if getattr(settings, "YOOKASSA_SANDBOX", True):
    Configuration.mode = "test"  # ключевое для sandbox

def create_yookassa_payment(order):
    payment = Payment.create(
        {
            "amount": {
                "value": str(order.total_price),
                "currency": "RUB",
            },
            "confirmation": {
                "type": "redirect",
                "return_url": f"{settings.FRONTEND_URL}/payment-success",
            },
            "capture": True,
            "description": f"Заказ №{order.id}",
            "metadata": {
                "order_id": str(order.id)
            }
        },
        str(uuid.uuid4())
    )
    return payment

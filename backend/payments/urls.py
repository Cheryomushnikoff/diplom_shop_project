from django.urls import path
from .views import CreateYooKassaPaymentView
from .webhooks import yookassa_webhook

urlpatterns = [
    path("yookassa/create/<int:order_id>/", CreateYooKassaPaymentView.as_view()),
    path("yookassa/webhook/", yookassa_webhook),
]

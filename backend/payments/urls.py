from django.urls import path
from .views import CreateYooKassaPaymentView, UserRefundAPIView
from .webhooks import yookassa_webhook

urlpatterns = [
    path("yookassa/create/<int:order_id>/", CreateYooKassaPaymentView.as_view()),
    path("yookassa/webhook/", yookassa_webhook),
    path("user-refund/<int:order_id>/", UserRefundAPIView.as_view()),
]

from django.db import models
from store.models import Order

class Payment(models.Model):
    STATUS_CHOICES = [
        ("pending", "В ожидании"),
        ("paid", "Оплачен"),
        ("canceled", "Отменён"),
    ]

    PROVIDER_CHOICES = [
        ("yookassa", "ЮKassa"),
        ("stripe", "Stripe"),
    ]

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="payments")
    provider = models.CharField(max_length=50, choices=PROVIDER_CHOICES)
    payment_id = models.CharField(max_length=255, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.provider} #{self.id} — {self.status}"


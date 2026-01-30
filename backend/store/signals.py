from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.db import transaction
from .models import Order


@receiver(pre_save, sender=Order)
def order_pre_save(sender, instance, **kwargs):
    if not instance.pk:
        instance._old_status = None
        return

    try:
        old = sender.objects.get(pk=instance.pk)
        instance._old_status = old.status
    except sender.DoesNotExist:
        instance._old_status = None


@receiver(post_save, sender=Order)
def order_email_notifications(sender, instance, created, **kwargs):

    def send_email():
        if not instance.email:
            return

        items = instance.items.all()
        if not items.exists():
            return  # не шлём пустой заказ

        lines = []
        lines.append(f"Спасибо за заказ!\n")
        lines.append(f"Номер заказа: {instance.id}")
        lines.append(f"Статус: {instance.get_status_display()}\n")
        lines.append("Состав заказа:")
        lines.append("-" * 30)

        total = 0
        for item in items:
            item_total = item.price * item.quantity
            total += item_total
            lines.append(
                f"• {item.product.name} — "
                f"{item.quantity} × {item.price} ₽ = {item_total} ₽"
            )

        lines.append("-" * 30)
        lines.append(f"Итого: {total} ₽\n")
        lines.append("Адрес доставки:")
        lines.append(instance.address)

        send_mail(
            subject=f"Заказ #{instance.id} оформлен",
            message="\n".join(lines),
            from_email=None,
            recipient_list=[instance.email],
            fail_silently=False,
        )

    transaction.on_commit(send_email)

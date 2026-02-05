from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.core.mail import EmailMessage
from django.db import transaction
from django.template.loader import render_to_string
from .models import Order, OrderItem
from shop_project import settings


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
    """
    Отправка письма ТОЛЬКО после коммита и если заказ реально создан или статус изменился
    """
    def send_email():
        # Получаем все товары заказа
        order_items = OrderItem.objects.filter(order=instance)
        if not order_items.exists():
            # Если товаров нет — не отправляем письмо
            return

        # Шаблоны по статусу
        status_templates = {
            "new": "store/email/order_new.html",
            "processing": "store/email/order_processing.html",
            "paid": "store/email/order_paid.html",
            "shipped": "store/email/order_shipped.html",
            "completed": "store/email/order_completed.html",
            "canceled": "store/email/order_canceled.html",
        }
        template = status_templates.get(instance.status, "store/email/order_new.html")
        subject = f"Заказ #{instance.id} — {instance.get_status_display()}"

        html_message = render_to_string(template, {
            "order": instance,
            "order_items": order_items,
        })

        email = EmailMessage(
            subject=subject,
            body=html_message,
            from_email=None,  # DEFAULT_FROM_EMAIL
            to=[instance.email],
        )
        email.content_subtype = "html"
        email.send(fail_silently=False)

    # 🔹 отправляем только после коммита
    transaction.on_commit(send_email)

@receiver(post_save, sender=Order)
def admin_notify_new_order(sender, instance, created, **kwargs):
    if not created or instance.status != "new":
        return

    def send_email():
        subject = f"🛒 Новый заказ #{instance.id}"

        body = f"""
Новый заказ в интернет-магазине

Заказ №: {instance.id}
Статус: {instance.get_status_display()}
Сумма: {instance.total_price} ₽

Клиент:
Имя: {instance.first_name} {instance.last_name}
Email: {instance.email}
Телефон: {instance.phone}

Адрес доставки:
{instance.address}
        """

        EmailMessage(
            subject=subject,
            body=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[email for _, email in settings.ADMINS],
        ).send(fail_silently=True)

    transaction.on_commit(send_email)

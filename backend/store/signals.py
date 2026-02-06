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
    def send_emails():
        # Получаем все товары заказа
        order_items = OrderItem.objects.filter(order=instance)
        if not order_items.exists():
            # Если товаров нет — не отправляем письмо
            return

        user_templates = {
            "new": "store/email/order_new.html",
            "processing": "store/email/order_processing.html",
            "paid": "store/email/order_paid.html",
            "shipped": "store/email/order_shipped.html",
            "completed": "store/email/order_completed.html",
            "canceled": "store/email/order_canceled.html",
        }

        user_template = user_templates.get(
            instance.status,
            "store/email/order_new.html"
        )

        user_html = render_to_string(
            user_template,
            {
                "order": instance,
                "order_items": order_items,
            }
        )

        user_email = EmailMessage(
            subject=f"Заказ #{instance.id} — {instance.get_status_display()}",
            body=user_html,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[instance.email],
        )
        user_email.content_subtype = "html"
        user_email.send(fail_silently=False)

        if instance.status == 'new':
            admin_html = render_to_string(
                "store/email/admin_new_order.html",
                {
                    "order": instance,
                    "order_items": order_items,
                }
            )
            print('дошли')
            admin_email = EmailMessage(
                subject=f"🛒 Новый заказ #{instance.id}",
                body=admin_html,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[email for _, email in settings.ADMINS],
            )
            admin_email.content_subtype = "html"
            admin_email.send(fail_silently=False)


    transaction.on_commit(send_emails)



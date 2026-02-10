from django.contrib.admin import AdminSite
from django.urls import reverse
from django.utils.safestring import mark_safe

from .models import Order
from django.contrib import messages

class ShopAdminSite(AdminSite):
    site_header = "Админка интернет-магазина"
    site_title = "Beads-shop"
    index_title = "Управление магазином"

    def each_context(self, request):
        context = super().each_context(request)

        if request.user.is_staff:
            new_orders_count = Order.objects.filter(status="new").count()
            paid_orders_count = Order.objects.filter(status="paid").count()
            if new_orders_count > 0:
                # Ссылка с фильтром по новым заказам
                url = reverse("admin:store_order_changelist") + "?status__exact=new"
                notif_text = mark_safe(
                    f'🔔 <a href="{url}">У вас {new_orders_count} новых заказ(а)</a>'
                )

                existing_messages = [
                    msg.message for msg in messages.get_messages(request)
                    if msg.level == messages.INFO
                ]
                if notif_text not in existing_messages:
                    messages.add_message(request, messages.INFO, notif_text)
            if paid_orders_count > 0:
                url = reverse("admin:store_order_changelist") + "?status__exact=paid"
                notif_text = mark_safe(
                    f'🔔 <a href="{url}">У вас {paid_orders_count} оплаченных заказ(а)</a>'
                )

                existing_messages = [
                    msg.message for msg in messages.get_messages(request)
                    if msg.level == messages.INFO
                ]
                if notif_text not in existing_messages:
                    messages.add_message(request, messages.INFO, notif_text)

        return context


admin_site = ShopAdminSite(name="shop_admin")




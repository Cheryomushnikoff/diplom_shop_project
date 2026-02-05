from django.contrib.admin import AdminSite
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
            if new_orders_count > 0:

                existing_messages = [
                    msg.message for msg in messages.get_messages(request)
                    if msg.level == messages.INFO
                ]

                notif_text = f'🔔 У вас {new_orders_count} новых заказ(а)'

                if notif_text not in existing_messages:
                    messages.add_message(request, messages.INFO, notif_text)

        return context


admin_site = ShopAdminSite(name="shop_admin")




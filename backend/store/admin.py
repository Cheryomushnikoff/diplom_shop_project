from django.contrib import admin, messages
from django.utils.html import format_html
from rest_framework.exceptions import ValidationError

from .admin_site import admin_site
from .forms import OrderAdminForm
from .models import Category, Product, Order, OrderItem, Review
from .services.order_status import can_change_status


class ProductAdmin(admin.ModelAdmin):
    list_display = (
            "id",
            "slug",
            "name",
            "price",
            "image",
            "description",
        )


class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")

admin_site.register(Category, CategoryAdmin)
admin_site.register(Product, ProductAdmin)

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    can_delete = False
    readonly_fields = ("product", "price", "quantity", "get_total")

    def get_total(self, obj):
        return obj.price * obj.quantity

    get_total.short_description = "Сумма"

    def has_module_permission(self, request):
        return request.user.is_staff

    def has_view_permission(self, request, obj=None):
        return request.user.is_staff

    def has_change_permission(self, request, obj=None):
        return request.user.is_staff

    def has_delete_permission(self, request, obj=None):
        return request.user.is_staff


@admin.register(Order, site=admin_site)
class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]
    form = OrderAdminForm

    list_display = (
        "order_id",
        "customer",
        "colored_status",
        "items_count",
        "total_price",
        "created_at",
    )

    list_filter = ("status", "created_at")
    search_fields = ("id", "email", "phone")
    ordering = ("-created_at",)

    def items_count(self, obj):
        return obj.items.count()

    items_count.short_description = "Товаров"

    def order_id(self, obj):
        if obj.status in ["new", "paid"]:
            return format_html("<strong>#{} 🔔</strong>", obj.id)
        return f"#{obj.id}"

    order_id.short_description = "Заказ"

    def customer(self, obj):
        name = f"{obj.first_name} {obj.last_name}".strip()
        return name or obj.email

    customer.short_description = "Клиент"

    def colored_status(self, obj):
        colors = {
            "new": "red",
            "processing": "orange",
            "paid": "aqua",
            "shipped": "purple",
            "completed": "green",
            "canceled": "gray",
        }
        return format_html(
            '<b style="color:{}">{}</b>',
            colors.get(obj.status, "black"),
            obj.get_status_display(),
        )

    colored_status.short_description = "Статус"


    def has_module_permission(self, request):
        return request.user.is_staff

    def has_view_permission(self, request, obj=None):
        return request.user.is_staff

    def has_change_permission(self, request, obj=None):
        return request.user.is_staff

    def has_delete_permission(self, request, obj=None):
        return request.user.is_staff


@admin.register(Review, site=admin_site)
class ReviewAdmin(admin.ModelAdmin):
    list_display = (
        "product",
        "user",
        "rating",
        "created_at",
    )

    list_filter = ("rating",)
    search_fields = ("product__name", "user__email")




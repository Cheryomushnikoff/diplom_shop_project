from django.contrib import admin
from django.utils.html import format_html

from .models import Category, Product, Order, OrderItem, Review

admin.site.register(Category)
admin.site.register(Product)

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product", "price", "quantity")

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "customer",
        "email",
        "phone",
        "colored_status",
        "total_price",
        "created_at",
    )

    list_filter = (
        "status",
        ("created_at", admin.DateFieldListFilter),
    )

    search_fields = (
        "id",
        "email",
        "phone",
        "first_name",
        "last_name",
    )

    ordering = ("-created_at",)

    inlines = [OrderItemInline]

    readonly_fields = ("created_at",)

    # ---------- КЛИЕНТ ----------
    def customer(self, obj):
        if obj.user:
            return obj.user.email
        return f"{obj.first_name} {obj.last_name}".strip() or "Гость"

    customer.short_description = "Клиент"

    # ---------- ЦВЕТНОЙ СТАТУС ----------
    def colored_status(self, obj):
        colors = {
            "new": "#dc3545",        # красный
            "processing": "#ffc107", # жёлтый
            "paid": "#0d6efd",       # синий
            "shipped": "#0dcaf0",    # голубой
            "completed": "#198754",  # зелёный
            "canceled": "#6c757d",   # серый
        }

        color = colors.get(obj.status, "#6c757d")

        return format_html(
            '<span style="'
            'padding:4px 8px;'
            'border-radius:12px;'
            'color:white;'
            'background:{};'
            'font-size:12px;'
            '">'
            '{}'
            '</span>',
            color,
            obj.get_status_display()
        )

    colored_status.short_description = "Статус"

    # ---------- ЗАПРЕТ РЕДАКТИРОВАНИЯ ----------
    def get_readonly_fields(self, request, obj=None):
        if obj and obj.status in ("paid", "shipped", "completed"):
            return (
                "first_name",
                "last_name",
                "email",
                "phone",
                "address",
                "total_price",
                "created_at",
            )
        return self.readonly_fields



@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = (
        "product",
        "user",
        "rating",
        "created_at",
    )

    list_filter = ("rating",)
    search_fields = ("product__name", "user__email")

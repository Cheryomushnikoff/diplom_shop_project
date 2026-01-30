from django.contrib import admin
from .models import Category, Product, Order, OrderItem

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
        "created_at",
        "status",
        "total_price",
        "email"
    )
    list_filter = ("status", "created_at")
    search_fields = ("id", "email", "phone")
    inlines = [OrderItemInline]
    readonly_fields = ("total_price", "created_at")

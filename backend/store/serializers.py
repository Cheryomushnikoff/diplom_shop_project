from rest_framework import serializers
from .models import Product, CartItem, Category, Order, OrderItem

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id',
            'name' ,
            'price' ,
            'category',
            'slug' ,
            'description' ,
            'image' ,
            'in_active' ,
            'created_at' ,
        ]

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields =[
            'id',
            'name',
            'image'
        ]

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), write_only=True, source='product')

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity']


class OrderCreateSerializer(serializers.Serializer):
    email = serializers.EmailField()
    phone = serializers.CharField()
    address = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()

class OrderListSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(
        source="get_status_display"
    )

    class Meta:
        model = Order
        fields = (
            "id",
            "created_at",
            "status_display",
            "total_price",
        )




class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )

    class Meta:
        model = OrderItem
        fields = (
            "id",
            "product_name",
            "price",
            "quantity",
        )


class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    status_display = serializers.CharField(
        source="get_status_display"
    )

    class Meta:
        model = Order
        fields = "__all__"




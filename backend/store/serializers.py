from django.db.models import Avg
from rest_framework import serializers
from .models import Product, CartItem, Category, Order, OrderItem, Review

class ProductSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id",
            "slug",
            "name",
            "price",
            "image",
            "description",
            "average_rating",
            "reviews_count",
        )

    def get_average_rating(self, obj):
        avg = obj.reviews.aggregate(avg=Avg("rating"))["avg"]
        return round(avg, 1) if avg else 0

    def get_reviews_count(self, obj):
        return obj.reviews.count()

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields =[
            'id',
            'name',
            'image',
            'slug',
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


class ReviewSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(
        source="user.email", read_only=True
    )
    user_name = serializers.CharField(
        source="user.first_name", read_only=True
    )
    user_id = serializers.IntegerField(
        source="user.id", read_only=True
    )

    class Meta:
        model = Review
        fields = (
            "id",
            "rating",
            "text",
            "created_at",
            "user_email",
            "user_name",
            "user_id",
        )


class TopProductSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["id", "slug", "name", "image", "price", "average_rating", "reviews_count"]

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews.exists():
            return 0
        return round(reviews.aggregate(avg_rating=serializers.models.Avg('rating'))['avg_rating'], 1)

    def get_reviews_count(self, obj):
        return obj.reviews.count()

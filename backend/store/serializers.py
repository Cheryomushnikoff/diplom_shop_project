from rest_framework import serializers
from .models import Product

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

    def create(self, validated_data):
        return Product.objects.create(**validated_data)


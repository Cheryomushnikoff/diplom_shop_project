from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, generics
from django.utils.text import slugify
from unidecode import unidecode

from .models import Cart, CartItem, Product
from .serializers import ProductSerializer

class ListProductAPIView(generics.ListAPIView):
    queryset = Product.objects.filter(in_active=True)
    serializer_class = ProductSerializer

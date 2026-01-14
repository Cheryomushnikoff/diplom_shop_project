from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from unidecode import unidecode

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .serializers import ProductSerializer
from .models import Category, Product

def main_page_view(request):
    return render(request, 'store/main_page.html')

def product_list_page(request):
    return render(request, 'store/product_list.html')

def product_card_view(request, slug):
    product = get_object_or_404(Product, slug=slug)
    return render(request, 'store/product_card.html',{'product': product})



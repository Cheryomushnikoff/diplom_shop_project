from django.shortcuts import render

from .models import Category, Product

def main_page_view(request):
    return render(request, 'store/main_page.html')

def product_list_view(request):
    product_list = Product.objects.all()

    return render(request, 'store/product_list.html', {'product_list': product_list})
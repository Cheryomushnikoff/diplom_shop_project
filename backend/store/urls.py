from django.urls import path


from .views import main_page_view, product_card_view, product_list_page
from .api_views import ListProductAPIView

app_name = 'store'

urlpatterns = [
    path('', main_page_view, name='main_page'),
    path('products/', product_list_page, name='products'),
    path('products/<slug>', product_card_view, name='product_card'),
    path('api/products/', ListProductAPIView.as_view()),
]
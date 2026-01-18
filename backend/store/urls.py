from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import (
    CartViewSet,
    CartSyncView,
    ListProductAPIView,
    ProductSearchView
)

from .views import main_page_view, product_card_view, product_list_page, cart_page


app_name = 'store'

router = DefaultRouter()
router.register(r'cart', CartViewSet, basename='cart')

urlpatterns = [
    path('', main_page_view, name='main_page'),
    path('products/', product_list_page, name='products'),
    path('products/<slug>', product_card_view, name='product_card'),
    path('api/products/', ListProductAPIView.as_view()),
    path("api/cart/sync/", CartSyncView.as_view(), name="cart-sync"),
    path("api/products/search/", ProductSearchView.as_view()),
    path('api/', include(router.urls)),

]
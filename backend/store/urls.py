from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import (
    CartViewSet,
    CartSyncView,
    ListProductAPIView,
    ProductSearchView,
    ListCategoryAPIView,
    CartMergeView,
    OrderCreateView,
    MyOrdersAPIView, MyOrderDetailAPIView, ProductDetailAPIView, ProductReviewAPIView, TopProductsAPIView
)

from .views import main_page_view, product_card_view, product_list_page, cart_page


app_name = 'store'

router = DefaultRouter()
router.register(r'cart', CartViewSet, basename='cart')

urlpatterns = [
    path("api/products/top/", TopProductsAPIView.as_view(), name="top-products"),
    path("api/products/search/", ProductSearchView.as_view()),
    path("api/products/<slug:slug>/", ProductDetailAPIView.as_view()),
    path("api/products/<slug:slug>/reviews/", ProductReviewAPIView.as_view()),
    path('api/orders/<int:order_id>/', MyOrderDetailAPIView.as_view()),
    path("api/orders/", MyOrdersAPIView.as_view()),
    path('api/orders/create/', OrderCreateView.as_view()),
    path('api/category/', ListCategoryAPIView.as_view()),
    path("api/cart/merge/", CartMergeView.as_view()),
    path('api/products/', ListProductAPIView.as_view()),
    path("api/cart/sync/", CartSyncView.as_view(), name="cart-sync"),
    path('api/', include(router.urls)),
    path("cart/", cart_page, name="cart"),

]
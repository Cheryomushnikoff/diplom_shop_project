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
    MyOrdersAPIView, MyOrderDetailAPIView, ProductDetailAPIView, ProductReviewAPIView, TopProductsAPIView,
    CancelOrderAPIView
)


app_name = 'store'



urlpatterns = [
    path('products/', ListProductAPIView.as_view()),
    path("products/top/", TopProductsAPIView.as_view(), name="top-products"),
    path("products/search/", ProductSearchView.as_view()),
    path("products/<slug:slug>/", ProductDetailAPIView.as_view()),
    path("products/<slug:slug>/reviews/", ProductReviewAPIView.as_view()),
    path("orders/", MyOrdersAPIView.as_view()),
    path('orders/<int:order_id>/', MyOrderDetailAPIView.as_view()),
    path('orders/create/', OrderCreateView.as_view()),
    path("orders/<int:pk>/cancel/", CancelOrderAPIView.as_view()),
    path('cart/', CartViewSet.as_view()),
    path("cart/merge/", CartMergeView.as_view()),
    path("cart/sync/", CartSyncView.as_view(), name="cart-sync"),
    path('category/', ListCategoryAPIView.as_view()),
]
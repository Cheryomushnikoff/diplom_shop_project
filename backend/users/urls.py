from django.urls import path
from .views import (
    RegisterView,
    LogoutView,
    current_user,
    EmailTokenObtainPairView,
    profile_view,
    change_password, VerifyEmailView)
from rest_framework_simplejwt.views import  TokenRefreshView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path("token/", EmailTokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView, name='logout'),
    path("user/", current_user, name="current_user"),
    path("profile/", profile_view),
    path("change_password/", change_password),
    path("verify-email/", VerifyEmailView.as_view()),

]
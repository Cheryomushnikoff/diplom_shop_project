# store/permissions.py
from rest_framework.permissions import BasePermission


class IsAuthenticatedAndPurchased(BasePermission):
    """
    Пользователь должен быть авторизован и иметь заказ с этим товаром
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

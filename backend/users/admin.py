from dataclasses import fields

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group

from .models import User
from store.admin_site import admin_site


# Register your models here.

@admin.register(User, site=admin_site) #  регистрирует модель в админке.
class UserAdmin(BaseUserAdmin): #  говорим, что админка должна использовать **UserAdmin**, который наследует поведение Django-админки для пользователей.
    list_display = ("email", "phone", "is_staff", "is_active")  # Эти поля будут показаны в таблице списка пользователей на странице admin → Users.
    list_filter = ("is_staff", "is_active")  #  Фильтры справа на странице списка пользователей.

    fieldsets = ( #  Описание структуры формы редактирования пользователя
        (None, {"fields": ("email", "phone", "password")}),
        ("Permissions", {"fields": ("is_staff", "is_active", "is_superuser", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login",)}),
    )

    add_fieldsets = ( # Это отдельное описание формы создания пользователя
        (None, {
            "classes": ("wide",),
            "fields": ("email", "phone", "password1", "password2", "is_staff", "is_active"),
        }),
    )

    search_fields = ("email", "phone")
    ordering = ("email",)

    # Скрываем от staff
    def has_module_permission(self, request):
        return request.user.is_superuser

    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_add_permission(self, request):
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


'''
Этот класс определяет весь интерфейс управления пользователями в админке:

- отображение списка пользователей,
- фильтры,
- поиск,
- редактирование,
- создание,
- работу с правами,
- правильную обработку паролей (через BaseUserAdmin),
- интеграцию с кастомной моделью User.

Без такого класса админка не сможет корректно создавать пользователей и работать с паролями.

'''
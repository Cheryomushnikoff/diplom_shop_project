import uuid

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone
from django.conf import settings
from .managers import UserManager

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True, verbose_name="Эл. почта")
    phone = models.CharField(max_length=20, unique=True, blank=True, null=True, verbose_name="Моб. тел.")

    address = models.CharField(max_length=500, blank=True, verbose_name="Адрес")

    first_name = models.CharField(max_length=200,blank=True, null=True, verbose_name="Имя")
    last_name = models.CharField(max_length=200, blank=True, null=True, verbose_name="Фамилия")
    second_name = models.CharField(max_length=200, blank=True, null=True, verbose_name="Отчество")

    is_active = models.BooleanField(default=False, verbose_name="Активирован")
    is_staff = models.BooleanField(default=False, verbose_name="Персонал")
    date_joined = models.DateTimeField(default=timezone.now, verbose_name="Дата регистрации")

    subscribed_to_newsletter = models.BooleanField(default=False, verbose_name="Подписка на новости")

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        db_table = 'users_users'

    def save(self, *args, **kwargs):
        if self.email:
            self.email = self.email.lower()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email


class EmailVerificationToken(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Verify {self.user.email}"

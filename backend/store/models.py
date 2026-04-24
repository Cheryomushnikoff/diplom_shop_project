from django.db import models
from django.db.models import Avg
from django.utils.text import slugify
from unidecode import unidecode
from shop_project import settings


from datetime import datetime


class Category(models.Model):
    name = models.CharField(max_length=200, unique=True, verbose_name='Наименование')
    image = models.ImageField(upload_to='category/', verbose_name='Изображение')
    slug = models.SlugField(unique=True, editable=False, verbose_name='Слаг')

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'

    def save(self, *args, **kwargs):
        self.slug = slugify(unidecode(self.name))
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=200, unique=True, verbose_name='Наименование')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Цена')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products', verbose_name='Категория')
    slug = models.SlugField(unique=True, editable=False, verbose_name='Слаг')
    description = models.TextField(blank=True, verbose_name="Описание")
    image = models.ImageField(upload_to='products/', verbose_name="Изображение")
    in_active = models.BooleanField(default=True, verbose_name="Активирован")
    created_at = models.DateTimeField(auto_now_add=True, blank=True, verbose_name="Создан")

    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.slug = slugify(unidecode(self.name))
        return super().save(*args, **kwargs)


class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        related_name='cart',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name="Пользователь"
    )

    session_key = models.CharField(
        max_length=40,
        null=True,
        blank=True,
        verbose_name="Ключ сессии"
    )

    update_at = models.DateTimeField(auto_now=True, verbose_name="Обновлен")

    class Meta:
        verbose_name = 'Корзина'
        verbose_name_plural = 'Корзины'


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items', verbose_name="Корзина")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name="Товар")
    quantity = models.PositiveIntegerField(default=1, verbose_name="Количество")

    class Meta:
        unique_together = ("cart", "product")
        verbose_name= 'Элемент корзины'
        verbose_name_plural = 'Элементы корзины'

    def get_total_price(self):
        return self.product.price * self.quantity

class Order(models.Model):
    STATUS_NEW = "new"
    STATUS_PAID = "paid"
    STATUS_REFUNDED = "refunded"
    STATUS_PROCESSING = "processing"
    STATUS_SHIPPED = "shipped"
    STATUS_COMPLETED = "completed"
    STATUS_CANCELED = "canceled"

    STATUS_CHOICES = [
        (STATUS_NEW, "Новый"),
        (STATUS_PAID, "Оплачен"),
        (STATUS_REFUNDED, "Отменён и деньги возвращёны"),
        (STATUS_PROCESSING, "В обработке"),
        (STATUS_SHIPPED, "Отправлен"),
        (STATUS_COMPLETED, "Завершён"),
        (STATUS_CANCELED, "Отменён"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Пользователь"
    )

    first_name = models.CharField(max_length=200, blank=True, verbose_name="Имя")
    last_name = models.CharField(max_length=200, blank=True, verbose_name="Фамилия")
    email = models.EmailField(verbose_name="Эл. почта")
    phone = models.CharField(max_length=30, verbose_name="Моб. тел.")
    address = models.CharField(max_length=500, verbose_name="Адрес")

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_NEW,
        verbose_name = "Статус"
    )

    total_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Полная цена")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создан")
    payment_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name = "Ключ оплаты"
    )

    class Meta:
        verbose_name= 'Заказ'
        verbose_name_plural = 'Заказы'

    def __str__(self):
        return f"Заказ #{self.id}"

class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        related_name="items",
        on_delete=models.CASCADE
    )
    product = models.ForeignKey("store.Product", on_delete=models.PROTECT)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()

    def get_total(self):
        return self.price * self.quantity

    class Meta:
        unique_together = ("cart", "product")
        verbose_name= 'Элемент заказа'
        verbose_name_plural = 'Элементы заказа'

class Review(models.Model):
    product = models.ForeignKey(
        "Product",
        on_delete=models.CASCADE,
        related_name="reviews"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    rating = models.PositiveSmallIntegerField()  # 1–5
    text = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("product", "user")  # 1 отзыв на товар
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'

    def __str__(self):
        return f"{self.product} — {self.rating}"
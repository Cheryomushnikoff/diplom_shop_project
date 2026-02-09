from django.conf import settings
from django.core.mail import EmailMessage
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import EmailVerificationToken

User = get_user_model()



class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        email = attrs.get("email", "").lower()
        password = attrs.get("password")

        user = authenticate(
            request=self.context.get("request"),
            email=email,
            password=password,
        )

        if not user:
            raise serializers.ValidationError(
                "Неверный email или пароль"
            )

        data = super().validate({
            "email": email,
            "password": password,
        })

        return data

from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(
        error_messages={
            "unique": "Пользователь с таким email уже зарегистрирован"
        }
    )

    class Meta:
        model = User
        fields = (
            "email",
            "password",
            "first_name",
            "last_name",
        )

    def validate_email(self, value):
        value = value.lower()

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Пользователь с таким email уже существует"
            )

        return value

    def create(self, validated_data):
        email = validated_data.pop("email").lower()
        password = validated_data.pop("password")

        user = User.objects.create_user(
            email=email,
            password=password,
            **validated_data
        )
        token = EmailVerificationToken.objects.create(user=user)

        verify_url = f"{settings.FRONTEND_URL}/api/accounts/verify-email?token={token.token}"

        html = f"""
               <h2>Подтверждение email</h2>
               <p>Для активации аккаунта нажмите:</p>
               <a href="{verify_url}">Подтвердить email</a>
               """

        email_message = EmailMessage(
            subject="Подтверждение регистрации",
            body=html,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
        )
        email_message.content_subtype = "html"
        email_message.send()

        return user



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "phone",
            "address",
            "first_name",
            "last_name",
            "second_name",
            "subscribed_to_newsletter",
        ]

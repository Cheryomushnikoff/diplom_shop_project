from django.conf import settings
from django.shortcuts import redirect
from rest_framework import generics, permissions, status
from rest_framework.views import APIView

from .models import EmailVerificationToken
from .serializers import RegisterSerializer, UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import EmailTokenObtainPairSerializer

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer

# Регистрация
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

# Логаут (удаляем refresh токен на фронтенде)
@api_view(['POST'])
def LogoutView(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()  # чтобы токен больше не использовался (если включена blacklist)
        return Response(status=205)
    except Exception as e:
        return Response(status=400)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    return Response({
        "id": user.id,
        "email": user.email,
        "name": user.first_name
    })

@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    if request.method == "GET":
        serializer = UserSerializer(user)
        return Response(serializer.data)
    elif request.method == "PUT":
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        print(serializer.errors)
        return Response(serializer.errors, status=400)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    old = request.data.get("old_password")
    new = request.data.get("new_password")

    if not old or not new:
        return Response({"error": "Оба поля обязательны"}, status=status.HTTP_400_BAD_REQUEST)

    if not user.check_password(old):
        return Response({"error": "Старый пароль неверен"}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new)
    user.save()
    return Response({"status": "Пароль успешно изменён"})

class VerifyEmailView(APIView):
    permission_classes = []

    def get(self, request):
        token = request.query_params.get("token")

        if not token:
            return Response(
                {"detail": "Токен не передан"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            verification = EmailVerificationToken.objects.get(token=token)
        except EmailVerificationToken.DoesNotExist:
            return Response(
                {"detail": "Неверный или устаревший токен"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = verification.user
        user.is_active = True
        user.save()

        verification.delete()

        return redirect(f"{settings.FRONTEND_URL}/email-verified")
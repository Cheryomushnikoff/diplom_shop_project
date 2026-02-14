from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()


class EmailOrPhoneBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        """
        username: то, что пользователь вводит (email или phone)
        """
        if username is None:
            username = kwargs.get(User.USERNAME_FIELD)

        # Ищем по email
        if '@' in username:
            try:
                user = User.objects.get(email__iexact=username.lower())
            except User.DoesNotExist:
                return None
        else:
            try:
                user = User.objects.get(phone=username)
            except User.DoesNotExist:
                return None

        if user and user.check_password(password):
            return user

        return None
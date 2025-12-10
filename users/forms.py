from django.contrib.auth.forms import AuthenticationForm, UserCreationForm

from django import forms
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError

User = get_user_model()

class CustomUserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label='Пароль', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Повторите пароль', widget=forms.PasswordInput)
    # email = forms.EmailField(
    #     max_length=200,
    #     label='Email',
    #     help_text='Обязательное поле для ввода',
    #     widget=forms.EmailInput(attrs={
    #         'placeholder': 'Макс. длинна 200 символов'
    # }))
    # phone = forms.CharField(max_length=200,
    #     help_text='Необязательное поле для ввода',
    #     label='Номер телефона',
    #     widget=forms.TextInput(attrs={
    #     'placeholder': 'Макс. длинна 200 символов'
    # }))

    class Meta:
        model = User
        fields = ('email', 'phone')

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise ValidationError('Пользователь с таким email уже существует')
        return email

    def clean_phone(self):
        phone = self.cleaned_data.get('phone')
        if phone and User.objects.filter(phone=phone).exists():
            raise ValidationError('Пользователь с таким номером уже существует')
        return phone

    def clean(self):
        cleaned_data = super().clean()
        p1 = cleaned_data.get('password1')
        p2 = cleaned_data.get('password2')

        if p1 and p2 and p1 != p2:
            raise ValidationError('Пароли должны совпадать')

        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.widget.attrs['class'] = 'form-control'


class CustomAuthForm(forms.Form):
    idetifier = forms.CharField(max_length=200, label='Телефон или Email', widget=forms.TextInput(attrs={
        'class': 'form-control'
    }))
    password = forms.CharField(max_length=200, label='Пароль', widget=forms.PasswordInput(attrs={
        'class': 'form-control'
    }))


    def clean(self):
        cleaned_data = super().clean()
        idetifier = cleaned_data.get('idetifier')
        password = cleaned_data.get('password')

        user = authenticate(username=idetifier, password=password)

        if not user:
            raise ValidationError('Неверный логин или пароль')

        cleaned_data['user'] = user
        return cleaned_data
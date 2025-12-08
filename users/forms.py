from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django import forms
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(
        max_length=200,
        label='Email',
        help_text='Обязательное поле для ввода',
        widget=forms.EmailInput(attrs={
            'placeholder': 'Макс. длинна 200 символов'
    }))
    phone = forms.CharField(max_length=200,
        help_text='Необязательное поле для ввода',
        label='Номер телефона',
        widget=forms.TextInput(attrs={
        'placeholder': 'Макс. длинна 200 символов'
    }))

    class Meta:
        model = User
        fields = ('email', 'phone', 'password1', 'password2')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.widget.attrs['class'] = 'form-control'
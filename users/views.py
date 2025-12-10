from django.shortcuts import render, redirect
from django.contrib.auth import login, logout

from .forms import CustomUserCreationForm, CustomAuthForm

def register_view(request):
    form = CustomUserCreationForm()

    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect('store:main_page')

    return render(request,'users/register.html', {'form': form.render('users/form_snippet.html')})


def login_view(request):
    form = CustomAuthForm()

    if request.method == 'POST':
        form = CustomAuthForm(request.POST)

        if form.is_valid():
            user = form.cleaned_data['user']
            login(request, user)
            return redirect('store:main_page')
    return render(request, 'users/login.html', context={'form': form.render('users/form_snippet.html')})


def logout_view(request):
    logout(request)
    return redirect('store:main_page')
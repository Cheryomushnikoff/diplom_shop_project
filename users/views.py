from django.shortcuts import render, redirect

from .forms import CustomUserCreationForm

def register_view(request):
    form = CustomUserCreationForm()

    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect('store:main_page')

    return render(request,'users/register.html', {'form': form.render('users/form_snippet.html')})
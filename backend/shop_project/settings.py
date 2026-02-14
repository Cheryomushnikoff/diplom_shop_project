from pathlib import Path
import os
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-iv6%dvznsix&tvwphgwp8+6=z&^xneym5j6h(m59)fcdr&($ac'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [
    "89.111.170.172",
    "localhost",
    "127.0.0.1",
    "127.0.0.1:8000",
    "beads-shop.ru"
    "www.beads-shop.ru"
]


# Application definition

INSTALLED_APPS = [
    "jazzmin",
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'users',
    "store.apps.StoreConfig",
    "payments",

]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://beads-shop.ru",
    "http://www.beads-shop.ru",
    "http://127.0.0.1:5173",
]

ROOT_URLCONF = 'shop_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.debug',
                'store.context_processors.categories_processors'
            ],
        },
    },
]

WSGI_APPLICATION = 'shop_project.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "shop",
        "USER": "shopuser",
        "PASSWORD": "shoppass",
        "HOST": "db",
        "PORT": 5432,
    }
}



# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'
STATICFILES_DIRS = [
    BASE_DIR / 'static'
]
STATIC_ROOT = BASE_DIR / 'staticfiles/'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTHENTICATION_BACKENDS = [
    'users.backends.EmailOrPhoneBackend',
    'django.contrib.auth.backends.ModelBackend'
]

AUTH_USER_MODEL = "users.User"

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
        ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser'
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': (
            'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(hours=2),
    'ROTATE_REFRESH_TOKENS': True,
}

#  Yandex SMTP
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

EMAIL_HOST = 'smtp.yandex.ru'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False

EMAIL_HOST_USER = 'Cheremushnikoff@yandex.ru'
EMAIL_HOST_PASSWORD = 'eurmwbvxszldkjjt'

DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

JAZZMIN_SETTINGS = {
    "site_title": "Админка магазина",
    "site_header": "Интернет-магазин",
    "site_brand": "Beads-shop",
    "welcome_sign": "Добро пожаловать в админку Beads-shop",

    "site_logo": "/img/diamants.gif",   # если есть
    "login_logo": None,

    "show_sidebar": True,
    "navigation_expanded": True,

    "search_model": [
        "store.Product",
        "store.Order",
        "auth.User",
    ],

    "icons": {
        "auth.User": "fas fa-user",
        "auth.Group": "fas fa-users",

        "store.Product": "fas fa-box",
        "store.Category": "fas fa-tags",
        "store.Order": "fas fa-shopping-cart",
        "store.OrderItem": "fas fa-list",
        "store.Review": "fas fa-star",
    },

    "default_icon_parents": "fas fa-folder",
    "default_icon_children": "fas fa-file",

    "order_with_respect_to": [
        "store.Category",
        "store.Product",
        "store.Order",
    ],

    "topmenu_links": [
        {"name": "Сайт", "url": "/", "new_window": True},
        {"model": "auth.User"},
    ],
}

JAZZMIN_UI_TWEAKS = {
    "theme": "flatly",
    "dark_mode_theme": "darkly",

    "navbar": "navbar-dark",
    "sidebar": "sidebar-dark-primary",

    "brand_colour": "navbar-dark",
    "accent": "accent-secondary",

    "button_classes": {
        "primary": "btn-secondary",
        "secondary": "btn-outline-secondary",
        "success": "btn-success",
        "warning": "btn-warning",
        "danger": "btn-danger",
        "info": "btn-info",
    },
}

ADMINS = [
    ("Admin", "cheremushnikoff@yandex.ru"),
]

DEFAULT_FROM_EMAIL = "cheremushnikoff@yandex.ru"

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://www.beads-shop.ru")

YOOKASSA_SHOP_ID = "1271978"
YOOKASSA_SECRET_KEY = "test_VrE7HJSZ7ubHv6Cbyw0X9ZM4C6S4-qevsSxPCXbEX10"
YOOKASSA_SANDBOX = True






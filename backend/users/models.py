from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.tokens import RefreshToken

from .managers import CustomUserManager

AUTH_PROVIDERS = {
	"email": "email",
	"google": "google",
}

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_("email address"), unique=True)
    username = models.CharField(max_length=150, blank=True, null=True, unique=True, verbose_name=_("Username"))
    is_verified = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    auth_provider = models.CharField(max_length=255, blank=False, null=False, default=AUTH_PROVIDERS.get("email"))
    language_preference = models.CharField(max_length=10, default='en')

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['username']

    objects = CustomUserManager()

    def save(self, *args, **kwargs):
        """Auto-generate a unique username if it's blank"""
        if not self.username:
            self.username = f"user_{self.pk or CustomUser.objects.count() + 1}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email

    def tokens(self):
        """Generate JWT access & refresh tokens"""
        refresh = RefreshToken.for_user(self)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

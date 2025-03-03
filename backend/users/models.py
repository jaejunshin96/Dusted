from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.tokens import RefreshToken

from .managers import CustomUserManager

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_("email address"), unique=True)
    username = models.CharField(max_length=150, blank=True, null=True, unique=True, verbose_name=_("Username"))
    first_name = models.CharField(max_length=150, default="", verbose_name=_("First Name"))
    last_name = models.CharField(max_length=150, default="", verbose_name=_("Last Name"))
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

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

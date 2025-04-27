from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ('id', "email", "username", 'auth_provider', 'is_verified', "is_staff", "is_active", "country", "language")
    list_filter = ('id', "email", "username", 'auth_provider', 'is_verified', "is_staff", "is_active", "country", "language")
    fieldsets = (
        (None, {"fields": ("email", "username", "password", "country", "language")}),
        ("Permissions", {"fields": ("is_staff", "is_active", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email", "username", "password1", "password2", "country", "language", "is_staff",
                "is_active", "groups", "user_permissions"
            )}
        ),
    )
    search_fields = ("email", 'auth_provider', 'country', 'language')
    ordering = ("email", 'auth_provider', 'language')


admin.site.register(CustomUser, CustomUserAdmin)

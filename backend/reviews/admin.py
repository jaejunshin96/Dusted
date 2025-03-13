from django.contrib import admin
from .models import Reviews

# Register your models here.
@admin.register(Reviews)
class ReviewAdmin(admin.ModelAdmin):
	list_display = ['title', 'user', 'rating', 'created_at', 'updated_at']
	search_fields = ['title', 'user__username', 'rating']
	list_filter = ['rating']

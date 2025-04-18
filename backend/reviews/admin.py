from django.contrib import admin
from .models import Review

# Register your models here.
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'movie_id', 'directors', 'rating', 'created_at', 'updated_at']
    search_fields = ['title', 'user__username', 'directors', 'movie_id']
    list_filter = ['rating', 'created_at']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = [
        ('Movie Information', {
            'fields': ['movie_id', 'title', 'directors', 'poster_path', 'backdrop_path']
        }),
        ('Review Details', {
            'fields': ['user', 'rating', 'review']
        }),
        ('Metadata', {
            'fields': ['created_at', 'updated_at'],
            'classes': ['collapse']
        })
    ]

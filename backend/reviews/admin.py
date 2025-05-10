from django.contrib import admin
from .models import Review, Folder

# Register Folder model
@admin.register(Folder)
class FolderAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'created_at', 'updated_at']
    search_fields = ['name', 'user__username']
    list_filter = ['created_at', 'updated_at']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = [
        ('Folder Information', {
            'fields': ['name', 'user']
        }),
        ('Metadata', {
            'fields': ['created_at', 'updated_at'],
            'classes': ['collapse']
        })
    ]

# Register your models here.
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'movie_id', 'directors', 'rating', 'folder', 'created_at', 'updated_at']
    search_fields = ['title', 'user__username', 'directors', 'cast', 'genre_ids', 'movie_id', 'folder__name']
    list_filter = ['rating', 'created_at', 'folder']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = [
        ('Movie Information', {
            'fields': ['movie_id', 'title', 'directors', 'cast', 'genre_ids', 'poster_path', 'backdrop_path']
        }),
        ('Review Details', {
            'fields': ['user', 'rating', 'review', 'folder']
        }),
        ('Metadata', {
            'fields': ['created_at', 'updated_at'],
            'classes': ['collapse']
        })
    ]

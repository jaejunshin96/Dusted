from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

class Folder(models.Model):
    name = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='folders')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['name', 'user']  # Folder names should be unique per user

    def __str__(self):
        return f"{self.name} (by {self.user.username})"

# Create your models here.
class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    movie_id = models.IntegerField(null=False, default=0)
    title = models.CharField(max_length=255)
    directors = models.CharField(max_length=255)
    cast = models.CharField(max_length=500, blank=True)
    genre_ids = models.CharField(max_length=255, blank=True)
    review = models.TextField(max_length=400, blank=True)
    rating = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(5)])
    backdrop_path = models.CharField(max_length=500, null=True, blank=True)
    poster_path = models.CharField(max_length=500, null=True, blank=True)
    folder = models.ForeignKey(Folder, on_delete=models.SET_NULL, related_name='reviews', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'movie_id']  # This makes movie_id unique per user

    def __str__(self):
        return f"{self.title} by {self.user.username}"

from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.
class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    movie_id = models.IntegerField(null=False, default=0)
    title = models.CharField(max_length=255)
    directors = models.CharField(max_length=255)
    review = models.TextField(max_length=400, blank=True)
    rating = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(5)])
    backdrop_path = models.CharField(max_length=500, null=True, blank=True)
    poster_path = models.CharField(max_length=500, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'movie_id']  # This makes movie_id unique per user

    def __str__(self):
        return f"{self.title} by {self.user.username}"

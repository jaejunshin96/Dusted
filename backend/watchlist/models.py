from django.db import models
from django.conf import settings

# Create your models here.
class Watchlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='watchlist')
    movie_id = models.IntegerField(null=False, default=0)
    title = models.CharField(max_length=255)
    directors = models.CharField(max_length=255)
    cast = models.CharField(max_length=500, blank=True)
    genre_ids = models.CharField(max_length=255, blank=True)
    release_date = models.DateField(blank=True, null=True)
    overview = models.TextField(blank=True)
    backdrop_path = models.CharField(max_length=255, blank=True, null=True)
    poster_path = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'movie_id')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.title}"

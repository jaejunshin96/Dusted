from .models import Review
from rest_framework import serializers

class ReviewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'user', 'movie_id', 'title', 'review', 'rating', 'image_path', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

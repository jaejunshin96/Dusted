from .models import Review, Folder
from rest_framework import serializers

class FolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields = ['id', 'name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class ReviewsSerializer(serializers.ModelSerializer):
    folder_id = serializers.IntegerField(source='folder.id', read_only=True, allow_null=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'movie_id', 'title', 'directors', 'review', 'rating',
                  'backdrop_path', 'poster_path', 'folder', 'folder_id', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'folder_id']

    def validate(self, attrs):
        review_text = attrs.get('review', '')
        if len(review_text) > 400:
            raise serializers.ValidationError({"review": "Review must be 400 characters or fewer."})
        return super().validate(attrs)

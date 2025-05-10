from rest_framework import serializers
from .models import Watchlist

class WatchlistSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Watchlist
        fields = ['id', 'user', 'username', 'movie_id', 'title', 'directors', 'cast', 'genre_ids', 'overview',
                  'release_date', 'backdrop_path', 'poster_path', 'created_at']
        read_only_fields = ['id', 'created_at', 'user']

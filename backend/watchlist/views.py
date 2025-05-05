from django.shortcuts import render
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Watchlist
from .serializers import WatchlistSerializer
import json
from django.core.cache import cache
from django.utils.encoding import force_str

class WatchlistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_id = request.user.id

        # Create a cache key for this user's watchlist
        cache_key = f"user:{user_id}:watchlist"

        # Try to get from cache
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(json.loads(force_str(cached_data)), status=status.HTTP_200_OK)

        # If not in cache, fetch from database
        watchlist = Watchlist.objects.filter(user=request.user)
        serializer = WatchlistSerializer(watchlist, many=True)

        # Cache the response for 15 minutes
        # Shorter time for watchlist as it changes frequently
        cache.set(cache_key, json.dumps(serializer.data), 60*15)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = WatchlistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)

            # Invalidate watchlist cache when adding a new item
            user_id = request.user.id
            cache.delete(f"user:{user_id}:watchlist")

            # Also invalidate the "in watchlist" status cache for this movie
            movie_id = request.data.get('movie_id')
            if movie_id:
                cache.delete(f"user:{user_id}:movie:{movie_id}:in_watchlist")

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'])
    def delete(self, request):
        movie_id = request.query_params.get('movie_id')
        if not movie_id:
            return Response({'error': 'movie_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            watchlist_item = Watchlist.objects.get(user=request.user, movie_id=movie_id)
            watchlist_item.delete()

            # Invalidate watchlist cache when removing an item
            user_id = request.user.id
            cache.delete(f"user:{user_id}:watchlist")

            # Also invalidate the "in watchlist" status cache for this movie
            cache.delete(f"user:{user_id}:movie:{movie_id}:in_watchlist")

            return Response(status=status.HTTP_204_NO_CONTENT)
        except Watchlist.DoesNotExist:
            return Response({'error': 'Watchlist item not found'}, status=status.HTTP_404_NOT_FOUND)

    # Add a method to check if a movie is in watchlist (commonly needed)
    def get_status(self, request, movie_id):
        if not movie_id:
            return Response({'error': 'movie_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        user_id = request.user.id

        # Create a cache key for this status check
        cache_key = f"user:{user_id}:movie:{movie_id}:in_watchlist"

        # Try to get from cache
        cached_data = cache.get(cache_key)
        if cached_data is not None:
            return Response({'in_watchlist': json.loads(force_str(cached_data))}, status=status.HTTP_200_OK)

        # If not in cache, check database
        in_watchlist = Watchlist.objects.filter(
            user=request.user,
            movie_id=movie_id
        ).exists()

        # Cache the result for 1 hour - status checks are frequent but don't change often
        cache.set(cache_key, json.dumps(in_watchlist), 60*60)

        return Response({'in_watchlist': in_watchlist}, status=status.HTTP_200_OK)

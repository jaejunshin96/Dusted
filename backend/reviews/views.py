from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Review, Folder
from .serializers import ReviewsSerializer, FolderSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
import json
from django.core.cache import cache
from django.utils.encoding import force_str

class ReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        movie_id = request.query_params.get('movie_id')
        user_id = request.user.id

        if not movie_id:
            return Response({'error': 'movie_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Create cache key using user ID and movie ID
        cache_key = f"user:{user_id}:reviewed_movie:{movie_id}"

        # Try to get from cache
        cached_data = cache.get(cache_key)
        if cached_data is not None:
            return Response({'reviewed': json.loads(force_str(cached_data))}, status=status.HTTP_200_OK)

        # If not in cache, query the database
        has_review = Review.objects.filter(user=request.user, movie_id=movie_id).exists()

        # Cache the result for 24 hours - status rarely changes
        cache.set(cache_key, json.dumps(has_review), 60*60*24)

        return Response({'reviewed': has_review}, status=status.HTTP_200_OK)

class ReviewsList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.GET.get('query', '')
        page = request.GET.get('page', 1)
        sorting = request.GET.get('sorting', None)
        order = request.GET.get('order', 'asc')
        folder_id = request.GET.get('folder_id', None)
        user_id = request.user.id

        # Update cache key to include folder_id
        cache_key = f"user:{user_id}:reviews:query:{query}:page:{page}:sorting:{sorting}:order:{order}:folder:{folder_id}"

        # Try to get from cache
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(json.loads(force_str(cached_data)), status=status.HTTP_200_OK)

        # If not in cache, continue with the existing logic
        orderDirection = "" if order == "asc" else "-"
        reviews = Review.objects.filter(user=request.user)

        # Filter by folder if folder_id is provided
        if folder_id:
            if folder_id == 'null':
                # Filter for reviews without a folder
                reviews = reviews.filter(folder__isnull=True)
            else:
                try:
                    folder = Folder.objects.get(id=folder_id, user=request.user)
                    reviews = reviews.filter(folder=folder)
                except Folder.DoesNotExist:
                    return Response({'Error': 'Folder not found'}, status=status.HTTP_404_NOT_FOUND)

        if query:
            reviews = reviews.filter(title__icontains=query)

        if sorting != "created_at" and sorting != "rating":
            try:
                rating_value = float(sorting)
                if rating_value < 0 or rating_value > 5:
                    return Response({'Error': 'Rating must be between 0 and 5.'}, status=status.HTTP_400_BAD_REQUEST)
                reviews = reviews.filter(rating=rating_value)
                reviews = reviews.order_by(orderDirection + "created_at")
            except ValueError:
                return Response({'Error': 'Rating must be a valid number.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            reviews = reviews.order_by(orderDirection + sorting)

        paginator = PageNumberPagination()
        paginator.page = int(page)
        paginator.page_size = 18
        result_page = paginator.paginate_queryset(reviews, request)
        serializer = ReviewsSerializer(result_page, many=True)

        # Get the paginated response
        response = paginator.get_paginated_response(serializer.data)

        # Cache the response for 1 hour
        cache.set(cache_key, json.dumps(response.data), 60*60)

        return response

    def post(self, request):
        # Check if the user already has a review for this movie
        movie_id = request.data.get('movie_id')
        user_id = request.user.id
        existing_review = Review.objects.filter(user=request.user, movie_id=movie_id).first()

        if existing_review:
            return Response({'error': 'You have already reviewed this movie'},
                            status=status.HTTP_409_CONFLICT)

        # Get folder_id from request data
        folder_id = request.data.get('folder_id', None)

        serializer = ReviewsSerializer(data=request.data)
        if serializer.is_valid():
            # Create review instance but don't save yet
            review = serializer.save(user=request.user)

            # Handle folder assignment
            if folder_id:
                try:
                    folder = Folder.objects.get(id=folder_id, user=request.user)
                    review.folder = folder
                    review.save()
                except Folder.DoesNotExist:
                    return Response({'Error': 'Folder not found'}, status=status.HTTP_404_NOT_FOUND)

            # Invalidate related caches
            self._invalidate_user_caches(user_id, movie_id)

            # Return updated serialized data with folder info
            serializer = ReviewsSerializer(review)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        try:
            user_id = request.user.id
            review = Review.objects.get(id=request.data['id'], user=request.user)
            movie_id = review.movie_id
        except Review.DoesNotExist:
            return Response({'Error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ReviewsSerializer(review, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            # Invalidate related caches
            self._invalidate_user_caches(user_id, movie_id)

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        try:
            user_id = request.user.id
            review = Review.objects.get(id=request.data['id'], user=request.user)
            movie_id = review.movie_id
        except Review.DoesNotExist:
            return Response({'Error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)

        review.delete()

        # Invalidate related caches
        self._invalidate_user_caches(user_id, movie_id)

        return Response({'Delete': 'Review has been deleted'}, status=status.HTTP_204_NO_CONTENT)

    def _invalidate_user_caches(self, user_id, movie_id=None):
        """Helper method to invalidate user-related caches when reviews change"""
        # Invalidate the specific movie review status cache
        if movie_id:
            cache.delete(f"user:{user_id}:reviewed_movie:{movie_id}")

        # Use pattern matching to delete all review list caches for this user
        # This is a simplified approach - in production you might want more selective invalidation
        cache_keys = cache.keys(f"user:{user_id}:reviews:*")
        if cache_keys:
            cache.delete_many(cache_keys)

# Add this new class for folder management
class FolderView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get all folders for the current user
        folders = Folder.objects.filter(user=request.user).order_by('created_at')
        serializer = FolderSerializer(folders, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Create a new folder
        serializer = FolderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        # Update a folder
        try:
            folder = Folder.objects.get(id=request.data['id'], user=request.user)
        except Folder.DoesNotExist:
            return Response({'Error': 'Folder not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = FolderSerializer(folder, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        # Delete a folder
        try:
            folder = Folder.objects.get(id=request.data['id'], user=request.user)
        except Folder.DoesNotExist:
            return Response({'Error': 'Folder not found'}, status=status.HTTP_404_NOT_FOUND)

        folder.delete()
        return Response({'Delete': 'Folder has been deleted'}, status=status.HTTP_204_NO_CONTENT)

# New view for moving reviews between folders
class MoveReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        review_id = request.data.get('review_id')
        folder_id = request.data.get('folder_id')  # Can be None to remove from folder

        try:
            review = Review.objects.get(id=review_id, user=request.user)
        except Review.DoesNotExist:
            return Response({'Error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)

        if folder_id:
            try:
                folder = Folder.objects.get(id=folder_id, user=request.user)
                review.folder = folder
            except Folder.DoesNotExist:
                return Response({'Error': 'Folder not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Remove from folder
            review.folder = None

        review.save()

        # Invalidate cache
        user_id = request.user.id
        cache_keys = cache.keys(f"user:{user_id}:reviews:*")
        if cache_keys:
            cache.delete_many(cache_keys)

        serializer = ReviewsSerializer(review)
        return Response(serializer.data)


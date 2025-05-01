from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Review
from .serializers import ReviewsSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination

class ReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        movie_id = request.query_params.get('movie_id')

        if not movie_id:
            return Response({'error': 'movie_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        has_review = Review.objects.filter(user=request.user, movie_id=movie_id).exists()

        return Response({'reviewed': has_review}, status=status.HTTP_200_OK)

class ReviewsList(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		query = request.GET.get('query', '')
		page = request.GET.get('page', 1)
		sorting = request.GET.get('sorting', None)
		order = request.GET.get('order', 'asc')
		orderDirection = "" if order == "asc" else "-"
		reviews = Review.objects.filter(user=request.user)

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
		else :
			reviews = reviews.order_by(orderDirection + sorting)

		paginator = PageNumberPagination()
		paginator.page = int(page)
		paginator.page_size = 18
		result_page = paginator.paginate_queryset(reviews, request)
		serializer = ReviewsSerializer(result_page, many=True)
		return paginator.get_paginated_response(serializer.data)

	def post(self, request):
		# Check if the user already has a review for this movie
		movie_id = request.data.get('movie_id')
		existing_review = Review.objects.filter(user=request.user, movie_id=movie_id).first()

		if existing_review:
			return Response({'error': 'You have already reviewed this movie'},
							status=status.HTTP_409_CONFLICT)

		serializer = ReviewsSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save(user=request.user)
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def patch(self, request):
		try:
			review = Review.objects.get(id=request.data['id'], user=request.user)
		except Review.DoesNotExist:
			return Response({'Error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)

		serializer = ReviewsSerializer(review, data=request.data, partial=True)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_200_OK)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request):
		try:
			review = Review.objects.get(id=request.data['id'], user=request.user)
		except Review.DoesNotExist:
			return Response({'Error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)

		review.delete()
		return Response({'Delete': 'Review has been deleted'}, status=status.HTTP_204_NO_CONTENT)


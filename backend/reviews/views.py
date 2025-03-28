from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Review
from .serializers import ReviewsSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination


class ReviewsList(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		query = request.GET.get('query', '')
		sorting = request.GET.get('sorting', None)
		reviews = Review.objects.filter(user=request.user)
		if query:
			reviews = reviews.filter(title__icontains=query)

		if sorting:
			try:
				rating_value = float(sorting)
				if rating_value < 0 or rating_value > 5:
					return Response({'Error': 'Rating must be between 0 and 5.'}, status=status.HTTP_400_BAD_REQUEST)
				reviews = reviews.filter(rating=rating_value)
			except ValueError:
				return Response({'Error': 'Rating must be a valid number.'}, status=status.HTTP_400_BAD_REQUEST)

		page = request.GET.get('page', 1)

		reviews = reviews.order_by("-created_at")
		paginator = PageNumberPagination()
		paginator.page = int(page)
		paginator.page_size = 12
		result_page = paginator.paginate_queryset(reviews, request)
		serializer = ReviewsSerializer(result_page, many=True)
		return paginator.get_paginated_response(serializer.data)

	def post(self, request):
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


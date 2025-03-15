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
		reviews = Review.objects.filter(user=request.user).order_by('-created_at')
		paginator = PageNumberPagination()
		paginator.page_size = 5
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


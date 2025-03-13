from .models import Reviews
from rest_framework import serializers

class ReviewsSerializer(serializers.ModelSerializer):
	class Meta:
		model = Reviews
		fields = '__all__'

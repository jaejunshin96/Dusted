from rest_framework import serializers
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "email", 'username', "first_name", "last_name", "is_staff", "is_active", "date_joined"]

class CustomUserRegisterationSerializer(serializers.ModelSerializer):
	password = serializers.CharField(max_length=68, min_length=6, write_only=True)
	password2 = serializers.CharField(max_length=68, min_length=6, write_only=True)

	class Meta:
		model = CustomUser
		fields = ['id', 'email', 'username', 'first_name', 'last_name', 'password', 'password2']

	# we need compare the two passwords the user provides
	def validate(self, attrs):
		password = attrs.get('password', '')
		password2 = attrs.get('password2', '')

		if password != password2:
			raise serializers.ValidationError("passwords do not match")
		return attrs

	def create(self, validated_data):
		user = CustomUser.objects.create_user(
			email = validated_data['email'],
			username = validated_data['username'],
			first_name = validated_data['first_name'],
			last_name = validated_data['last_name'],
			password = validated_data['password'],
		)
		return user

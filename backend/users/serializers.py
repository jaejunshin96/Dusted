from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "email", 'username', "is_staff", "is_active", "date_joined"]

class UserRegisterationSerializer(serializers.ModelSerializer):
	password = serializers.CharField(max_length=68, min_length=6, write_only=True)
	password2 = serializers.CharField(max_length=68, min_length=6, write_only=True)

	class Meta:
		model = CustomUser
		fields = ['email', 'username', 'password', 'password2']

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
			password = validated_data['password'],
		)
		return user


class LoginSerializer(serializers.Serializer):
	email = serializers.EmailField()
	username = serializers.CharField(max_length=150, read_only=True)
	password = serializers.CharField(max_length=68, write_only=True)
	access_token = serializers.CharField(max_length=255, read_only=True)
	refresh_token = serializers.CharField(max_length=255, read_only=True)

	class Meta:
		model = CustomUser
		fields = ['id', 'email', 'username', 'password', 'access_token', 'refresh_token']

	def validate(self, attrs):
		email = attrs.get('email')
		password = attrs.get('password')
		#request = self.context.get('request')
		filtered_user_by_email = CustomUser.objects.filter(email=email)
		user = authenticate(email=email, password=password)

		if filtered_user_by_email.exists() and filtered_user_by_email[0].auth_provider != 'email':
			raise AuthenticationFailed(
				detail='Please continue your login using ' + filtered_user_by_email[0].auth_provider)

		if not user:
			raise AuthenticationFailed(f"invalid credentials try again")

		user_tokens = user.tokens()

		return {
			'id': user.id,
			'email': user.email,
			'username': user.username,
			'access_token': str(user_tokens.get('access')),
			'refresh_token': str(user_tokens.get('refresh'))
		}

class LogoutSerializer(serializers.Serializer):
	refresh = serializers.CharField()

	def validate(self, attrs):
		self.token = attrs['refresh']
		return attrs

	def save(self, **kwargs):
		try:
			RefreshToken(self.token).blacklist()
		except TokenError:
			raise serializers.ValidationError("Invalid token")

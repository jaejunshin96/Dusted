from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "email", 'username', "first_name", "last_name", "is_staff", "is_active", "date_joined"]

class UserRegisterationSerializer(serializers.ModelSerializer):
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
		)
		user.set_password(validated_data['password'])
		user.save()
		return user


class LoginSerializer(serializers.Serializer):
	email = serializers.EmailField()
	username = serializers.CharField(max_length=150, read_only=True)
	password = serializers.CharField(max_length=68, write_only=True)
	first_name = serializers.CharField(max_length=150, read_only=True)
	last_name = serializers.CharField(max_length=150, read_only=True)
	access_token = serializers.CharField(max_length=255, read_only=True)
	refresh_token = serializers.CharField(max_length=255, read_only=True)

	class Meta:
		model = CustomUser
		fields = ['id', 'email', 'username', 'first_name', 'last_name', 'password', 'access_token', 'refresh_token']

	def validate(self, attrs):
		email = attrs.get('email')
		password = attrs.get('password')
		request = self.context.get('request')

		user = authenticate(request=request, email=email, password=password)
		if not user:
			raise AuthenticationFailed(f"invalid credentials try again")

		user_tokens = user.tokens()

		return {
			'id': user.id,
			'email': user.email,
			'username': user.username,
			'first_name': user.first_name,
			'last_name': user.last_name,
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

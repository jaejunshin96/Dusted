from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .models import CustomUser
from django.utils.encoding import smart_bytes, smart_str
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import PasswordResetTokenGenerator

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "email", 'username', "is_staff", "is_active", "date_joined", 'language_preference']

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

class EmailVerificationSerializer(serializers.ModelSerializer):
    pass

class LoginSerializer(serializers.Serializer):
	email = serializers.EmailField()
	username = serializers.CharField(max_length=150, read_only=True)
	password = serializers.CharField(max_length=68, write_only=True)
	access_token = serializers.CharField(max_length=255, read_only=True)
	refresh_token = serializers.CharField(max_length=255, read_only=True)

	class Meta:
		model = CustomUser
		fields = ['id', 'email', 'username', 'password', 'access_token', 'refresh_token', 'language']

	def validate(self, attrs):
		email = attrs.get('email')
		password = attrs.get('password')
		filtered_user_by_email = CustomUser.objects.filter(email=email)
		user = authenticate(email=email, password=password)

		if filtered_user_by_email.exists() and filtered_user_by_email[0].auth_provider != 'email':
			raise AuthenticationFailed(
				detail='Please continue your login using ' + filtered_user_by_email[0].auth_provider)

		if not user:
			raise AuthenticationFailed(f"invalid credentials try again")
		if not user.is_verified:
			raise AuthenticationFailed("Email is not verified")

		user_tokens = user.tokens()

		return {
			'id': user.id,
			'email': user.email,
			'username': user.username,
			'access_token': str(user_tokens.get('access')),
			'refresh_token': str(user_tokens.get('refresh')),
			'language': user.language,
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

class RequestPasswordResetEmailSerializer(serializers.Serializer):
	email = serializers.EmailField()

	redirect_url = serializers.CharField(max_length=500, required=False)

	class Meta:
		fields = ['email', 'redirect_url']

class SetNewPasswordSerializer(serializers.Serializer):
	password = serializers.CharField(min_length=6, max_length=68, write_only=True)
	password2 = serializers.CharField(min_length=6, max_length=68, write_only=True)
	token = serializers.CharField(min_length=1, write_only=True)
	uidb64 = serializers.CharField(min_length=1, write_only=True)

	class Meta:
		fields = ['password', 'password2', 'token', 'uidb64']

	def validate(self, attrs):
		try:
			password = attrs.get('password')
			password2 = attrs.get('password2')
			token = attrs.get('token')
			uidb64 = attrs.get('uidb64')

			id = smart_str(urlsafe_base64_decode(uidb64))
			user = CustomUser.objects.get(id=id)

			if password != password2:
				raise serializers.ValidationError({'Error': 'Passwords do not match'})

			if not PasswordResetTokenGenerator().check_token(user, token):
				raise AuthenticationFailed('The reset link is invalid', 401)

			user.set_password(password)
			user.save()
			return user
		except Exception as e:
			raise AuthenticationFailed('The reset link is invalid', 401)

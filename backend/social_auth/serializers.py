from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from .register import register_social_user
from . import google
import os

class GoogleSocialAuthSerializer(serializers.Serializer):
    auth_code = serializers.CharField(required=False)
    auth_token = serializers.CharField(required=False)
    locale = serializers.CharField(required=False, default='')
    redirect = serializers.BooleanField(required=False, default=False)
    redirect_uri = serializers.CharField(required=False, default='')

    def validate(self, attrs):
        """Handle both token-based and code-based auth flows"""
        redirect = attrs.get('redirect', False)
        locale = attrs.get('locale', '')

        if redirect:
            # Handle authorization code flow
            auth_code = attrs.get('auth_code')
            if not auth_code:
                raise serializers.ValidationError('Authorization code is required for redirect flow')

            redirect_uri = attrs.get('redirect_uri', '')
            user_data = google.Google.exchange_auth_code(auth_code, redirect_uri)

            if isinstance(user_data, str) and user_data.startswith(('Error', 'The token')):
                raise serializers.ValidationError(user_data)
        else:
            # Handle ID token flow (original implementation)
            auth_token = attrs.get('auth_token')
            if not auth_token:
                raise serializers.ValidationError('Authentication token is required')

            user_data = google.Google.validate(auth_token)

            if isinstance(user_data, str):
                raise serializers.ValidationError(
                    'The token is invalid or expired. Please login again.'
                )

        try:
            user_data['sub']
        except:
            raise serializers.ValidationError(
                'The token is invalid or expired. Please login again.'
            )

        if user_data['aud'] != os.environ.get('VITE_GOOGLE_CLIENT_ID'):
            raise AuthenticationFailed('oops, who are you?')

        email = user_data['email']
        name = user_data['name']
        provider = 'google'

        language = ''
        country = ''
        if locale:
            # Split locale to get language and country if available
            language = locale.split('-')[0] if '-' in locale else locale
            country = locale.split('-')[1] if '-' in locale else ''

        return register_social_user(
            provider=provider,
            email=email,
            name=name,
            language=language,
            country=country
        )

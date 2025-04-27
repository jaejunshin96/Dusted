from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from .register import register_social_user
from . import google
import os

class GoogleSocialAuthSerializer(serializers.Serializer):
    auth_token = serializers.CharField()
    locale = serializers.CharField(required=False, default='')

    def validate(self, attrs):
        """Use validate() instead of validate_auth_token() to access multiple fields"""
        auth_token = attrs.get('auth_token')
        locale = attrs.get('locale', '')

        user_data = google.Google.validate(auth_token)

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

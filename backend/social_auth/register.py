from django.contrib.auth import authenticate
from users.models import CustomUser
import os
import random
from rest_framework.exceptions import AuthenticationFailed


def generate_username(name):
    username = "".join(name.split(' ')).lower()
    if not CustomUser.objects.filter(username=username).exists():
        return username
    else:
        random_username = username + str(random.randint(0, 1000))
        return generate_username(random_username)

def register_social_user(provider, email, name, language='', country=''):
    filtered_user_by_email = CustomUser.objects.filter(email=email)

    if filtered_user_by_email.exists():
        user = filtered_user_by_email[0]

        # Update language and country if they're provided
        if language and not user.language:
            user.language = language
            user.save(update_fields=['language'])

        if country and not user.country:
            user.country = country
            user.save(update_fields=['country'])

        if provider == user.auth_provider:

            registered_user = authenticate(
                email=email, password=os.environ.get('SOCIAL_SECRET')
            )

            user_tokens = registered_user.tokens()

            return {
                'id': registered_user.id,
                'email': registered_user.email,
                'username': registered_user.username,
                'language': registered_user.language,
                'country': registered_user.country,
                'access_token': str(user_tokens.get('access')),
                'refresh_token': str(user_tokens.get('refresh'))
            }

        else:
            raise AuthenticationFailed(
                detail='Please continue your login using ' + filtered_user_by_email[0].auth_provider)

    else:
        user = {
            'email': email,
            'username': generate_username(name),
            'password': os.environ.get('SOCIAL_SECRET'),
            'language': language,
            'country': country
        }
        user = CustomUser.objects.create_user(**user)
        user.is_verified = True
        user.auth_provider = provider
        user.save()

        new_user = authenticate(
            email=email, password=os.environ.get('SOCIAL_SECRET')
        )

        user_tokens = new_user.tokens()

        return {
            'id': new_user.id,
            'email': new_user.email,
            'username': new_user.username,
            'language': new_user.language,
            'country': new_user.country,
            'access_token': str(user_tokens.get('access')),
            'refresh_token': str(user_tokens.get('refresh'))
        }

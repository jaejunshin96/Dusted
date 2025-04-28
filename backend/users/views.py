from django.conf import settings
from django.shortcuts import redirect
import jwt
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .models import CustomUser
from .serializers import UserSerializer, UserRegisterationSerializer, LoginSerializer, LogoutSerializer,\
    RequestPasswordResetEmailSerializer, SetNewPasswordSerializer
from .utils import Util
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import smart_bytes, smart_str, DjangoUnicodeDecodeError
from reviews.models import Review
import os
from dotenv import load_dotenv

load_dotenv()

class UserDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        try:
            user = CustomUser.objects.get(username=username)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({"Error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # Get additional profile information
        review_count = Review.objects.filter(user=user).count()

        # Use the existing serializer but add review count
        serializer = UserSerializer(user)
        data = serializer.data
        data['review_count'] = review_count

        return Response(data, status=status.HTTP_200_OK)

class RegisterUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegisterationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()

            user_data = serializer.data
            user = CustomUser.objects.get(email=user_data['email'])

            token = jwt.encode({"user_id": user.id}, settings.SECRET_KEY, algorithm="HS256")

            current_site = os.getenv("BACKEND_URL", "http://localhost")
            relative_link = reverse('verify-email')
            absurl = current_site + relative_link + "?token=" + str(token)
            email_body = 'Hello, ' + user.username + '\n' + \
                'Welcome to Dusted.\n' + \
                'Use the link below to verify your email.\n\n' + absurl
            data = {'email_body': email_body, 'to_email': user.email,
                    'email_subject': 'Verify your email to activate the account'}

            Util.send_email(data)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'Error': "registration view"}, serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmail(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        token = request.GET.get('token')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user = CustomUser.objects.get(id=payload['user_id'])
            if not user.is_verified:
                user.is_verified = True
                user.save()
            domain_url = os.getenv("FRONTEND_URL", "http://localhost")
            activation_confirm_url = f"{domain_url}/activation-confirm?token={token}"
            return redirect(activation_confirm_url)
            #return Response({'email': 'Successfully activated'}, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError as identifier:
            return Response({'Error': 'Activation Expired'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError as identifier:
            return Response({'Error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

class ValidateActivationToken(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        token = request.GET.get('token')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user = CustomUser.objects.get(id=payload['user_id'])

            if user.is_verified:
                return Response({'success': True}, status=status.HTTP_200_OK)
            return Response({'Error': 'User not verified'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.ExpiredSignatureError:
            return Response({'Error': 'Token expired'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.DecodeError:
            return Response({'Error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'Error': "login view"}, serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

class RequestPasswordResetEmail(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RequestPasswordResetEmailSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.data['email']

            if CustomUser.objects.filter(email=email).exists():
                user = CustomUser.objects.get(email=email)
                if user.auth_provider == 'google':
                    return Response(
                        {'google': 'Password reset is not allowed for Google-authenticated accounts. Please use Google Sign-In.'},
                        status=status.HTTP_403_FORBIDDEN
                    )
                uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
                token = PasswordResetTokenGenerator().make_token(user)

                current_site = os.getenv("BACKEND_URL", "http://localhost")
                relative_link = reverse('password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})

                absurl = current_site + relative_link
                email_body = 'Hello, \nUse link below to reset your password.\n\n' + absurl
                data = {'email_body': email_body, 'to_email': user.email,
                        'email_subject': 'Reset your password'}

                Util.send_email(data)
                return Response({'success': 'We have sent you a link to reset your password.'}, status=status.HTTP_200_OK)
            return Response({'Error': 'Email not found'}, status=status.HTTP_404_NOT_FOUND)

class PasswordResetTokenConfirm(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            id = smart_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                #I guess this should be a redirect to the frontend 404 page?
                #return Response({'Error': 'Token is not valid, please request a new one'}, status=status.HTTP_401_UNAUTHORIZED)
                domain_url = os.getenv("FRONTEND_URL", "http://localhost")
                frontend_404_url = f'{domain_url}/404'
                return redirect(frontend_404_url)

            domain_url = os.getenv("FRONTEND_URL", "http://localhost")
            password_reset_complete_url = f"{domain_url}/password-reset-complete?uidb64={uidb64}&token={token}"
            return redirect(password_reset_complete_url)
        except DjangoUnicodeDecodeError as identifier:
            return Response({'Error': 'Token is not valid, please request a new one'}, status=status.HTTP_401_UNAUTHORIZED)

class SetNewPasswordAPIView(APIView):
    permission_classes = [AllowAny]

    def patch(self, request):
        serializer = SetNewPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success': True, 'message': 'Password reset successful'}, status=status.HTTP_200_OK)

class UpdateUserLanguageView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        language = request.data.get('language')

        if language:
            user.language = language
            user.save(update_fields=['language'])
            return Response({'message': 'Language updated successfully'}, status=status.HTTP_200_OK)
        return Response({'error': 'Language not provided'}, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateUserCountryView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        country = request.data.get('country')

        if country:
            user.country = country
            user.save(update_fields=['country'])
            return Response({'message': 'Country updated successfully'}, status=status.HTTP_200_OK)
        return Response({'error': 'Country not provided'}, status=status.HTTP_400_BAD_REQUEST)

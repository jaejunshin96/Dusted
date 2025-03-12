from django.conf import settings
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

class UserDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        try:
            user = CustomUser.objects.get(username=username)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({"Error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class RegisterUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegisterationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()

            user_data = serializer.data
            user = CustomUser.objects.get(email=user_data['email'])

            token = jwt.encode({"user_id": user.id}, settings.SECRET_KEY, algorithm="HS256")

            current_site = get_current_site(request).domain
            relative_link = reverse('verify-email')
            absurl = 'http://' + current_site + relative_link + "?token=" + str(token)
            email_body = 'Hi '+user.username + \
            ' Use the link below to verify your email \n' + absurl
            data = {'email_body': email_body, 'to_email': user.email,
                    'email_subject': 'Verify your email'}

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
            return Response({'email': 'Successfully activated'}, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError as identifier:
            return Response({'Error': 'Activation Expired'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError as identifier:
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
                uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
                token = PasswordResetTokenGenerator().make_token(user)

                current_site = get_current_site(request).domain
                relative_link = reverse('password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
                redirect_url = request.data.get('redirect_url', '')

                absurl = 'http://' + current_site + relative_link
                email_body = 'Hello, \n Use link below to reset your password \n' + absurl + "?redirect_url=" + redirect_url
                data = {'email_body': email_body, 'to_email': user.email,
                        'email_subject': 'Reset your password'}

                Util.send_email(data)
                return Response({'success': 'We have sent you a link to reset your password'}, status=status.HTTP_200_OK)
            return Response({'Error': 'Email not found'}, status=status.HTTP_404_NOT_FOUND)

class PasswordTokenCheckAPI(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        redirecte_url = request.GET.get('redirect_url')

        try:
            id = smart_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({'Error': 'Token is not valid, please request a new one'}, status=status.HTTP_401_UNAUTHORIZED)

            return Response({'success': True, 'message': 'Credentials Valid', 'uidb64': uidb64, 'token': token}, status=status.HTTP_200_OK)
        except DjangoUnicodeDecodeError as identifier:
            return Response({'Error': 'Token is not valid, please request a new one'}, status=status.HTTP_401_UNAUTHORIZED)

class SetNewPasswordAPIView(APIView):
    permission_classes = [AllowAny]

    def patch(self, request):
        serializer = SetNewPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success': True, 'message': 'Password reset successful'}, status=status.HTTP_200_OK)

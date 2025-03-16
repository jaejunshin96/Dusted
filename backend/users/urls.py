from django.urls import path
from .views import UserDetailAPIView, RegisterUserView, VerifyEmail, ValidateActivationToken, LoginView, LogoutView, \
	RequestPasswordResetEmail, PasswordTokenCheckAPI, SetNewPasswordAPIView

urlpatterns = [
	path('user/<str:username>/', UserDetailAPIView.as_view(), name='user-detail'),
	path('register/', RegisterUserView.as_view(), name='register-user'),
	path('verify-email/', VerifyEmail.as_view(), name='verify-email'),
	path('validate-activation-token/', ValidateActivationToken.as_view(), name='validate-activation-token'),
	path('login/', LoginView.as_view(), name='login'),
	path('logout/', LogoutView.as_view(), name='logout'),
	path('request-reset-email/', RequestPasswordResetEmail.as_view(), name='request-reset-email'),
	path('password-reset/<uidb64>/<token>/', PasswordTokenCheckAPI.as_view(), name='password-reset-confirm'),
	path('password-reset-complete/', SetNewPasswordAPIView.as_view(), name='password-reset-complete'),
]


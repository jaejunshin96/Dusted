from django.urls import path
from .views import UserDetailAPIView, UserProfileView, RegisterUserView, VerifyEmail, ValidateActivationToken, LoginView, LogoutView, \
	RequestPasswordResetEmail, PasswordResetTokenConfirm, SetNewPasswordAPIView

urlpatterns = [
	path('user/<str:username>/', UserDetailAPIView.as_view(), name='user-detail'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
	path('register/', RegisterUserView.as_view(), name='register-user'),
	path('verify-email/', VerifyEmail.as_view(), name='verify-email'),
	path('validate-activation-token/', ValidateActivationToken.as_view(), name='validate-activation-token'),
	path('login/', LoginView.as_view(), name='login'),
	path('logout/', LogoutView.as_view(), name='logout'),
	path('request-password-reset-email/', RequestPasswordResetEmail.as_view(), name='request-password-reset-email'),
	path('password-reset-confirm/<uidb64>/<token>/', PasswordResetTokenConfirm.as_view(), name='password-reset-confirm'),
	path('password-reset-complete/', SetNewPasswordAPIView.as_view(), name='password-reset-complete'),
]


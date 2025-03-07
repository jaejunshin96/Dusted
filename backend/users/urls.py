from django.urls import path
from .views import UserDetailAPIView, RegisterUserView, VerifyEmail, LoginView, LogoutView

urlpatterns = [
	path('user/<str:username>/', UserDetailAPIView.as_view(), name='user-detail'),
	path('register/', RegisterUserView.as_view(), name='register-user'),
	path('verify-email/', VerifyEmail.as_view(), name='verify-email'),
	path('login/', LoginView.as_view(), name='login'),
	path('logout/', LogoutView.as_view(), name='logout'),
]


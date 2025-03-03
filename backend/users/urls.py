from django.urls import path
from .views import UserDetailAPIView, RegisterUserView

urlpatterns = [
	path('user/<str:username>/', UserDetailAPIView.as_view(), name='user-detail'),
	path('register/', RegisterUserView.as_view(), name='register-user'),
]


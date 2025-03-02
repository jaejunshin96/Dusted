from django.urls import path
from .views import UserDetailAPIView

urlpatterns = [
	path('user/<str:username>/', UserDetailAPIView.as_view(), name='user-detail'),
]


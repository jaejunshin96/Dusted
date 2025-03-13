from django.urls import path
from .views	import ReviewsList

urlpatterns = [
	path('reviews/', ReviewsList.as_view(), name='reviews-list'),
]

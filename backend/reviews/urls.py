from django.urls import path
from .views	import ReviewsList, ReviewView

urlpatterns = [
	path('reviews/', ReviewsList.as_view(), name='reviews-list'),
    path("reviews/status/", ReviewView.as_view(), name="review"),
]

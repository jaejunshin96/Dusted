from django.urls import path
from .views import ReviewsList, ReviewView, FolderView, MoveReviewView

urlpatterns = [
    path('reviews/', ReviewsList.as_view(), name='reviews-list'),
    path("reviews/status/", ReviewView.as_view(), name="review"),
    path("folders/", FolderView.as_view(), name="folders"),
    path("reviews/move/", MoveReviewView.as_view(), name="move-review"),
]

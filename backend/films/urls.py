from django.urls import path
from .views import SearchMovieAPIView

urlpatterns = [
    path("search/", SearchMovieAPIView.as_view(), name="search-movie"),
]

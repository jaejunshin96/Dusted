from django.urls import path
from .views import SearchMovieAPIView, ExploreMoviesAPIView, TrailerAPIView

urlpatterns = [
    path("trailer/", TrailerAPIView.as_view(), name="trailer"),
    path("explore/", ExploreMoviesAPIView.as_view(), name="explore-movies"),
    path("search/", SearchMovieAPIView.as_view(), name="search-movie"),
]

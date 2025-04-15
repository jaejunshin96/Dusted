from django.urls import path
from .views import SearchMovieAPIView, ExploreMoviesAPIView

urlpatterns = [
    path("search/", SearchMovieAPIView.as_view(), name="search-movie"),
    path("explore/", ExploreMoviesAPIView.as_view(), name="explore-movies"),
]

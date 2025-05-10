import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
import json
from django.core.cache import cache
from django.utils.encoding import force_str

class TrailerAPIView(APIView):
    def get(self, request):
        movie_id = request.GET.get("movie_id")
        lang = request.GET.get('lang', 'en-US')

        if not movie_id:
            return Response({"error": "movie_id parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Create a cache key for this trailer request
        cache_key = f"movie:trailer:{movie_id}:{lang}"

        # Try to get from cache
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(json.loads(force_str(cached_data)), status=status.HTTP_200_OK)

        url = f"https://api.themoviedb.org/3/movie/{movie_id}/videos?language={lang}"

        headers = {
            "accept": "application/json",
            "Authorization": f"Bearer {settings.TMDB_API_ACCESS_TOKEN}"
        }

        try:
            response = requests.get(url, headers=headers)
            if response.status_code != 200:
                return Response({"error": "Failed to fetch trailer"}, status=response.status_code)

            data = response.json()
            trailers = data.get("results", [])
            if trailers:
                # Filter for the first trailer
                trailer = trailers[0]

                # Cache trailer data for 30 days (trailers rarely change)
                cache.set(cache_key, json.dumps(trailer), 60*60*24*30)

                return Response(trailer, status=status.HTTP_200_OK)
            else:
                return Response({"error": "No trailers found"}, status=status.HTTP_404_NOT_FOUND)

        except requests.RequestException as e:
            return Response({"error": "Request failed", "details": str(e)},
                           status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ExploreMoviesAPIView(APIView):
    def get(self, request):
        search_type = request.GET.get("search_type", "now_playing")
        page = request.GET.get("page", 1)
        lang = request.GET.get('lang', 'en-US')
        region = request.GET.get('region', 'us')

        # Create a unique cache key
        cache_key = f"movie:explore:{search_type}:{page}:{lang}:{region}"

        # Try to get from cache first
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(json.loads(force_str(cached_data)), status=status.HTTP_200_OK)

        url = f"https://api.themoviedb.org/3/movie/{search_type}?language={lang}&page={page}&region={region}"

        headers = {
            "accept": "application/json",
            "Authorization": f"Bearer {settings.TMDB_API_ACCESS_TOKEN}"
        }

        try:
            response = requests.get(url, headers=headers)
            if response.status_code != 200:
                return Response({"error": "Failed to fetch movies"}, status=response.status_code)

            data = response.json()
            movies = data.get("results", [])
            movies_with_directors = []

            for movie in movies:
                movie_id = movie.get("id")

                if movie_id:
                    # Check if we have cached director and cast information
                    director_cache_key = f"movie:directors:{movie_id}:{lang}"
                    cast_cache_key = f"movie:cast:{movie_id}:{lang}"
                    cached_directors = cache.get(director_cache_key)
                    cached_cast = cache.get(cast_cache_key)

                    if cached_directors:
                        movie['directors'] = json.loads(force_str(cached_directors))

                    if cached_cast:
                        movie['cast'] = json.loads(force_str(cached_cast))

                    if not cached_directors or not cached_cast:
                        # Fetch credits for the movie
                        credits_url = f"https://api.themoviedb.org/3/movie/{movie_id}/credits?language={lang}"
                        credits_response = requests.get(credits_url, headers=headers)

                        if credits_response.status_code == 200:
                            credits_data = credits_response.json()

                            # Get directors if not cached
                            if not cached_directors:
                                directors = [member['name'] for member in credits_data.get('crew', [])
                                            if member.get('job') == 'Director']
                                # Cache director information for 7 days
                                cache.set(director_cache_key, json.dumps(directors), 60*60*24*7)
                                movie['directors'] = directors

                            # Get top 5 cast members if not cached
                            if not cached_cast:
                                cast = [actor['name'] for actor in credits_data.get('cast', [])[:5]]
                                # Cache cast information for 7 days
                                cache.set(cast_cache_key, json.dumps(cast), 60*60*24*7)
                                movie['cast'] = cast
                        else:
                            if not cached_directors:
                                movie['directors'] = []
                            if not cached_cast:
                                movie['cast'] = []

                movies_with_directors.append(movie)

            # Update the data with processed movies
            data['results'] = movies_with_directors

            # Cache the final result for 1 hour
            cache.set(cache_key, json.dumps(data), 60*60)

            return Response(data, status=status.HTTP_200_OK)

        except requests.RequestException as e:
            return Response({"error": "Request failed", "details": str(e)},
                           status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SearchMovieAPIView(APIView):
    def get(self, request):
        query = request.GET.get("query")
        page = request.GET.get("page", 1)
        lang = request.GET.get('lang', 'en-US')
        region = request.GET.get('region', 'us')

        if not query:
            return Response({"error": "Query parameter is required"},
                           status=status.HTTP_400_BAD_REQUEST)

        # Create a cache key for search results
        cache_key = f"movie:search:{query}:{page}:{lang}:{region}"

        # Try to get from cache
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(json.loads(force_str(cached_data)), status=status.HTTP_200_OK)

        url = f"https://api.themoviedb.org/3/search/movie?query={query}&include_adult=false&language={lang}&page={page}&region={region}"

        headers = {
            "accept": "application/json",
            "Authorization": f"Bearer {settings.TMDB_API_ACCESS_TOKEN}"
        }

        try:
            response = requests.get(url, headers=headers)
            if response.status_code != 200:
                return Response({"error": "Failed to fetch movies"}, status=response.status_code)

            data = response.json()
            movies = data.get("results", [])
            movies_with_directors = []

            for movie in movies:
                movie_id = movie.get("id")

                if movie_id:
                    # Check if we have cached director and cast information
                    director_cache_key = f"movie:directors:{movie_id}:{lang}"
                    cast_cache_key = f"movie:cast:{movie_id}:{lang}"
                    cached_directors = cache.get(director_cache_key)
                    cached_cast = cache.get(cast_cache_key)

                    if cached_directors:
                        movie['directors'] = json.loads(force_str(cached_directors))

                    if cached_cast:
                        movie['cast'] = json.loads(force_str(cached_cast))

                    if not cached_directors or not cached_cast:
                        # Fetch credits for the movie
                        credits_url = f"https://api.themoviedb.org/3/movie/{movie_id}/credits?language={lang}"
                        credits_response = requests.get(credits_url, headers=headers)

                        if credits_response.status_code == 200:
                            credits_data = credits_response.json()

                            # Get directors if not cached
                            if not cached_directors:
                                directors = [member['name'] for member in credits_data.get('crew', [])
                                            if member.get('job') == 'Director']
                                # Cache director information for 7 days
                                cache.set(director_cache_key, json.dumps(directors), 60*60*24*7)
                                movie['directors'] = directors

                            # Get top 5 cast members if not cached
                            if not cached_cast:
                                cast = [actor['name'] for actor in credits_data.get('cast', [])[:5]]
                                # Cache cast information for 7 days
                                cache.set(cast_cache_key, json.dumps(cast), 60*60*24*7)
                                movie['cast'] = cast
                        else:
                            if not cached_directors:
                                movie['directors'] = []
                            if not cached_cast:
                                movie['cast'] = []

                movies_with_directors.append(movie)

            # Sort movies by popularity in descending order
            sorted_movies = sorted(movies_with_directors, key=lambda m: m.get('popularity', 0), reverse=True)

            # Update data with sorted movies
            data['results'] = sorted_movies

            # Cache search results for 1 hour
            cache.set(cache_key, json.dumps(data), 60*60)

            return Response(data, status=status.HTTP_200_OK)

        except requests.RequestException as e:
            return Response({"error": "Request failed", "details": str(e)},
                           status=status.HTTP_500_INTERNAL_SERVER_ERROR)

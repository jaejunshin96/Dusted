import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class ExploreMoviesAPIView(APIView):
    def get(self, request):
        page = request.GET.get("page", 1)
        lang = request.GET.get('lang', 'en-US')
        region = request.GET.get('region', 'us')

        url = f"https://api.themoviedb.org/3/movie/popular?language={lang}&page={page}&region={region}"

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
                    # Fetch directors for the movie
                    credits_url = f"https://api.themoviedb.org/3/movie/{movie_id}/credits?language={lang}"
                    credits_response = requests.get(credits_url, headers=headers)

                    if credits_response.status_code == 200:
                        credits_data = credits_response.json()
                        # Extract directors from crew
                        directors = [member['name'] for member in credits_data.get('crew', []) if member.get('job') == 'Director']

                        # Add directors to the movie dictionary
                        movie['directors'] = directors
                    else:
                        movie['directors'] = []

                    movies_with_directors.append(movie)

            # Send the modified response
            data['results'] = movies_with_directors
            return Response(data, status=status.HTTP_200_OK)

        except requests.RequestException as e:
            return Response({"error": "Request failed", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SearchMovieAPIView(APIView):
    def get(self, request):
        query = request.GET.get("query")
        page = request.GET.get("page", 1)
        lang = request.GET.get('lang', 'en-US')

        if not query:
            return Response({"error": "Query parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        url = f"https://api.themoviedb.org/3/search/movie?query={query}&include_adult=false&language={lang}&page={page}"

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
                    # Fetch directors for the movie
                    credits_url = f"https://api.themoviedb.org/3/movie/{movie_id}/credits?language={lang}"
                    credits_response = requests.get(credits_url, headers=headers)

                    if credits_response.status_code == 200:
                        credits_data = credits_response.json()
                        # Extract directors from crew
                        directors = [member['name'] for member in credits_data.get('crew', []) if member.get('job') == 'Director']

                        # Add directors to the movie dictionary
                        movie['directors'] = directors

                    movies_with_directors.append(movie)

            # Sort movies by popularity in descending order
            sorted_movies = sorted(movies_with_directors, key=lambda m: m.get('popularity', 0), reverse=True)

            # Send the modified response
            data['results'] = sorted_movies
            return Response(data, status=status.HTTP_200_OK)

        except requests.RequestException as e:
            return Response({"error": "Request failed", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

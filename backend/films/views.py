import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class SearchMovieAPIView(APIView):
    def get(self, request):
        query = request.GET.get("query")

        if not query:
            return Response({"error": "Query parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        url = f"https://api.themoviedb.org/3/search/movie?query={query}&include_adult=false&language=en-US&page=1"

        headers = {
            "accept": "application/json",
            "Authorization": f"Bearer {settings.TMDB_API_ACCESS_TOKEN}"
        }

        try:
            response = requests.get(url, headers=headers)
            data = response.json()

            if response.status_code != 200:
                return Response({"error": "Failed to fetch movies", "details": data}, status=response.status_code)

            return Response(data, status=status.HTTP_200_OK)

        except requests.RequestException as e:
            return Response({"error": "Request failed", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

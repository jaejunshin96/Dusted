from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .models import CustomUser
from .serializers import CustomUserSerializer, CustomUserRegisterationSerializer

class UserDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        try:
            user = CustomUser.objects.get(username=username)
            serializer = CustomUserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class RegisterUserView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		serializer = CustomUserRegisterationSerializer(data=request.data)
		if serializer.is_valid(raise_exception=True):
			serializer.save()
			return Response({'data': serializer.data}, status=status.HTTP_201_CREATED)
		return Response({'message': "ERROR with registration view"}, serializer.errors, status=status.HTTP_400_BAD_REQUEST)

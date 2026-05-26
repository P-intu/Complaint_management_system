from django.shortcuts import render

# Create your views here.
from rest_framework.generics import CreateAPIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.models import User

from .serializers import RegisterSerializer, MyTokenObtainPairSerializer, UserSerializer


class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = 'chatbot_api'

urlpatterns = [
    # --- Authentication URLs ---
    path('auth/register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('auth/login/', views.UserLoginView.as_view(), name='user-login'),
    path('auth/verify/', views.UserVerifyView.as_view(), name='user-verify'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    
    # --- ImageKit URL ---
    path('imagekit-auth/', views.ImageKitUploadView.as_view(), name='imagekit-auth'),

    # --- Consolidated Chat URLs ---
    
    # Handles GET (list all chats) and POST (create a new chat)
    path('chats/', views.ChatListView.as_view(), name='chat-list-create'),
    
    # Handles GET (retrieve), PUT/PATCH (update), and DELETE for a single chat
    path('chats/<uuid:id>/', views.ChatDetailView.as_view(), name='chat-detail'),
]
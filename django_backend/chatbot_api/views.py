from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404

# --- Updated Model and Serializer Imports ---
from .models import CustomUser, Chat, Message
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserSerializer,
    ChatSerializer,       # Will need updates to handle nested messages
    MessageSerializer,    # A new serializer for the Message model
)
# Note: get_imagekit_service is assumed to be in a services.py file
from .services import get_imagekit_service

# --- User Authentication Views (Largely Unchanged) ---

class UserRegistrationView(generics.CreateAPIView):
    """User registration endpoint"""
    queryset = CustomUser.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'token': str(refresh.access_token)
        }, status=status.HTTP_201_CREATED)


class UserLoginView(APIView):
    """User login endpoint"""
    permission_classes = [AllowAny]
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'token': str(refresh.access_token)
        })


class UserVerifyView(APIView):
    """Token verification endpoint"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class ImageKitUploadView(APIView):
    """ImageKit upload authentication endpoint"""
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            imagekit_service = get_imagekit_service()
            auth_params = imagekit_service.get_authentication_parameters()
            return Response(auth_params)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# --- Refactored Chat Views ---

class ChatListView(generics.ListCreateAPIView):
    """
    List all of a user's chats or create a new one.
    This replaces both UserChatsListView and ChatCreateView.
    """
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Only return chats owned by the currently authenticated user."""
        return Chat.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Create a new Chat and its first Message.
        The request body should contain the initial message content.
        Example POST body: {"initial_message": "Hello, world!"}
        """
        user = self.request.user
        initial_message_content = self.request.data.get('initial_message')
        
        if not initial_message_content:
            # You should add proper error handling here
            raise ValueError("Initial message content is required.")

        # Create the chat instance with a title
        chat_title = (initial_message_content[:75] + '...') if len(initial_message_content) > 75 else initial_message_content
        chat = serializer.save(user=user, title=chat_title)

        # Create the first message in the chat
        Message.objects.create(
            chat=chat,
            sender=Message.SenderChoices.USER,
            content=initial_message_content
        )

class ChatDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update (add messages), or delete a specific chat.
    This replaces ChatDetailView, ChatUpdateView, and ChatDeleteView.
    """
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id' # Corresponds to the chat_id in the URL

    def get_queryset(self):
        """Only allow access to chats owned by the currently authenticated user."""
        return Chat.objects.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        """
        Handles adding a new message pair (user question + AI answer) to the chat.
        Example PUT/PATCH body: {"question": "...", "answer": "..."}
        """
        chat = self.get_object()
        question = request.data.get('question')
        answer = request.data.get('answer')

        if not question or not answer:
            return Response(
                {'error': 'Both question and answer are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create the user's message
        Message.objects.create(
            chat=chat,
            sender=Message.SenderChoices.USER,
            content=question
        )
        
        # Create the AI's response message
        Message.objects.create(
            chat=chat,
            sender=Message.SenderChoices.AI,
            content=answer
        )

        serializer = self.get_serializer(chat)
        return Response(serializer.data)
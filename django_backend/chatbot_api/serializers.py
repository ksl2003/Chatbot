from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser, Chat, Message


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        # Use first_name and last_name instead of the custom 'name' field
        fields = ('email', 'username', 'first_name', 'last_name', 'contact_number', 'password', 'password_confirm')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        # Remove the confirmation password, it's not needed for user creation
        validated_data.pop('password_confirm')
        
        # Use the create_user method to handle password hashing
        user = CustomUser.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        user = authenticate(request=self.context.get('request'), username=email, password=password)
        if not user:
            raise serializers.ValidationError('Invalid login credentials.', code='authorization')
        
        attrs['user'] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user data (without password)."""
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'date_joined')
        read_only_fields = ('id', 'date_joined')


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for the Message model."""
    class Meta:
        model = Message
        fields = ('id', 'sender', 'content', 'timestamp')


class ChatSerializer(serializers.ModelSerializer):
    """
    Main serializer for the Chat model.
    Handles listing chats and retrieving chat details with nested messages.
    """
    # Nest the MessageSerializer to include all messages within a chat
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Chat
        fields = ('id', 'title', 'user', 'created_at', 'messages')
        read_only_fields = ('user',) # User is set automatically in the view
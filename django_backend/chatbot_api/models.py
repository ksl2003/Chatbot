from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class CustomUser(AbstractUser):
    """
    Custom User model that uses email as the primary identifier instead of username.
    """
    # AbstractUser already has username, first_name, last_name, email.
    # We will make email the login field and make it unique.
    email = models.EmailField(unique=True, help_text="Required. Used for login.")
    
    # We can use the built-in first_name and last_name instead of a custom 'name' field.
    # Let's make them required for this example.
    first_name = models.CharField(max_length=150, blank=False)
    last_name = models.CharField(max_length=150, blank=False)
    contact_number = models.CharField(max_length=20, blank=True, null=True)

    # Use email as the username for authentication
    USERNAME_FIELD = 'email'
    
    # 'username' is still a field on AbstractUser, so it must be in REQUIRED_FIELDS
    # if you want to set it during createsuperuser. We'll also require first/last name.
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return self.email

class Chat(models.Model):
    """
    Represents a single conversation thread.
    The actual conversation history is stored in the Message model.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='chats')
    title = models.CharField(max_length=200, default="New Chat")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.user.email})"

class Message(models.Model):
    """
    Represents a single message within a Chat.
    This provides a much better structure than a JSONField.
    """
    class SenderChoices(models.TextChoices):
        USER = 'user', 'User'
        AI = 'ai', 'AI'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=10, choices=SenderChoices.choices)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"Message from {self.get_sender_display()} in Chat {self.chat.id}"
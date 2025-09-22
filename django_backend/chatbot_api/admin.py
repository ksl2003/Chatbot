from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Chat, Message

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """Admin configuration for the CustomUser model."""
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('email',)
    
    # fieldsets to display on the change user page
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'contact_number')}),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    # add_fieldsets to display on the add user page
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'first_name', 'last_name', 'password', 'password2'),
        }),
    )

class MessageInline(admin.TabularInline):
    """
    Allows viewing and editing Messages directly within the Chat admin page.
    """
    model = Message
    extra = 1  # Number of empty forms to display
    readonly_fields = ('timestamp',)
    fields = ('sender', 'content', 'timestamp')

@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    """Admin configuration for the Chat model."""
    list_display = ('title', 'user', 'created_at')
    list_filter = ('created_at', 'user')
    search_fields = ('title', 'user__email')
    readonly_fields = ('id', 'created_at')
    ordering = ('-created_at',)
    inlines = [MessageInline]  # Embed the Message model in the Chat view

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    """Admin configuration for the Message model."""
    list_display = ('chat', 'sender', 'content', 'timestamp')
    list_filter = ('sender', 'timestamp')
    search_fields = ('content', 'chat__title')
    readonly_fields = ('id', 'timestamp')
    ordering = ('-timestamp',)
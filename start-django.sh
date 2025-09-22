#!/bin/bash

echo "🚀 Starting Django Backend Server..."

# Navigate to Django backend directory
cd "/home/suryak/My Space/Projects/ChatBot/django_backend"

# Activate virtual environment
source venv/bin/activate

# Start the server
echo "Starting Django server on http://localhost:8001"
python manage.py runserver 8001
# Complete Setup Guide for Django Backend Migration

## 🚀 **Step-by-Step Setup Instructions**

### **1. Start Django Backend Server**
```bash
# Navigate to Django backend directory
cd "/home/suryak/My Space/Projects/ChatBot/django_backend"

# Activate virtual environment
source venv/bin/activate

# Start the server
python manage.py runserver 8001
```

### **2. Create Frontend Environment File**
Create a file called `.env` in the `client` directory with the following content:

```env
# API Configuration
VITE_API_URL=http://localhost:8001

# ImageKit Configuration
VITE_IMAGE_KIT_ENDPOINT=your-imagekit-endpoint
VITE_IMAGE_KIT_PUBLIC_KEY=your-imagekit-public-key

# Google Gemini Configuration
VITE_GEMINI_PUBLIC_KEY=your-gemini-api-key
```

### **3. Create Django Environment File**
Create a file called `.env` in the `django_backend` directory with the following content:

```env
# Django Settings
SECRET_KEY=django-insecure-change-this-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DB_NAME=chitchat_db
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432

# Client Configuration
CLIENT_URL=http://localhost:5173

# ImageKit Configuration (optional for development)
IMAGE_KIT_ENDPOINT=your-imagekit-endpoint
IMAGE_KIT_PUBLIC_KEY=your-imagekit-public-key
IMAGE_KIT_PRIVATE_KEY=your-imagekit-private-key

# Google Gemini Configuration
GEMINI_API_KEY=your-gemini-api-key
```

### **4. Test API Endpoints**

#### **Test ImageKit Upload:**
```bash
curl http://localhost:8001/api/upload/
```

#### **Test User Registration:**
```bash
curl -X POST http://localhost:8001/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "name": "Test User",
    "password": "testpass123",
    "password_confirm": "testpass123"
  }'
```

#### **Test User Login:**
```bash
curl -X POST http://localhost:8001/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### **5. Start Frontend Development Server**
```bash
# Navigate to client directory
cd "/home/suryak/My Space/Projects/ChatBot/client"

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

### **6. Run Both Servers Together**

#### **Terminal 1 - Django Backend:**
```bash
cd "/home/suryak/My Space/Projects/ChatBot/django_backend"
source venv/bin/activate
python manage.py runserver 8001
```

#### **Terminal 2 - React Frontend:**
```bash
cd "/home/suryak/My Space/Projects/ChatBot/client"
npm run dev
```

## 📋 **API Endpoints Available**

- **Base URL:** `http://localhost:8001/api/`
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/auth/verify/` - Token verification
- `GET /api/upload/` - ImageKit authentication
- `POST /api/chats/` - Create new chat
- `GET /api/userchats/` - Get user's chat list
- `GET /api/chats/<id>/` - Get chat details
- `PUT /api/chats/<id>/update/` - Update chat
- `DELETE /api/chats/<id>/delete/` - Delete chat

## ✅ **Migration Complete!**

Your Django backend is now a complete replacement for your Node.js backend with:
- ✅ JWT authentication
- ✅ Chat management
- ✅ ImageKit integration
- ✅ User management
- ✅ CORS configuration for frontend

## 🔧 **Troubleshooting**

### **Port Already in Use:**
```bash
# Kill existing Django processes
pkill -f "python manage.py runserver"

# Or use a different port
python manage.py runserver 8002
```

### **Database Issues:**
```bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### **Frontend Not Connecting:**
- Ensure `VITE_API_URL=http://localhost:8001` in client/.env
- Check that Django server is running on port 8001
- Verify CORS settings in Django settings.py
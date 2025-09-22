# ChitiChat Django Backend

This is the Django backend for the ChitiChat application, migrated from Node.js/Express.js.

## Features

- **User Authentication**: JWT-based authentication with Django REST Framework SimpleJWT
- **Chat Management**: Create, read, update, and delete chat conversations
- **ImageKit Integration**: File upload authentication for ImageKit.io
- **Google Gemini Integration**: Ready for Gemini API integration (currently handled by frontend)
- **PostgreSQL Database**: Uses PostgreSQL as the primary database

## Installation

1. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Environment Setup**:
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Database Setup**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create a superuser** (optional):
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the development server**:
   ```bash
   python manage.py runserver
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/auth/verify/` - Token verification
- `POST /api/auth/token/refresh/` - Refresh JWT token

### Chat Management
- `POST /api/chats/` - Create new chat
- `GET /api/userchats/` - Get user's chat list
- `GET /api/chats/<id>/` - Get specific chat details
- `PUT /api/chats/<id>/update/` - Update chat with new messages
- `DELETE /api/chats/<id>/delete/` - Delete chat

### File Upload
- `GET /api/upload/` - Get ImageKit authentication parameters

## Environment Variables

See `env.example` for all required environment variables:

- `SECRET_KEY`: Django secret key
- `DEBUG`: Debug mode (True/False)
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`: Database configuration
- `CLIENT_URL`: Frontend URL for CORS
- `IMAGE_KIT_ENDPOINT`, `IMAGE_KIT_PUBLIC_KEY`, `IMAGE_KIT_PRIVATE_KEY`: ImageKit configuration
- `GEMINI_API_KEY`: Google Gemini API key

## Database Models

### CustomUser
Extended Django User model with email as username and additional name field.

### Chat
Stores chat conversations with JSON history field containing message arrays.

### UserChats
Stores user's chat list with titles and metadata.

## Migration from Node.js

This Django backend replicates the following Node.js functionality:

- **Models**: Mongoose schemas converted to Django models
- **Authentication**: JWT middleware converted to DRF SimpleJWT
- **Routes**: Express routes converted to DRF views and URL patterns
- **Services**: ImageKit integration ported to Python
- **Database**: MongoDB converted to PostgreSQL with Django ORM

## Development

- **Admin Interface**: Available at `/admin/` for database management
- **API Documentation**: Use Django REST Framework browsable API
- **Testing**: Run tests with `python manage.py test`

## Production Deployment

1. Set `DEBUG=False` in environment variables
2. Configure production database
3. Set up static file serving
4. Configure HTTPS and security settings
5. Use a production WSGI server like Gunicorn
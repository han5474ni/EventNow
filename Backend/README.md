# EventNow - Backend API

EventNow is a platform for discovering and managing campus events. This repository contains the backend API built with FastAPI.

## Features

- User authentication (JWT)
- Role-based access control (Admin, Student, General)
- Event management (CRUD operations)
- Event registration
- Comments and ratings
- Event recommendations
- Image upload for events

## Prerequisites

- Python 3.8+
- SQLite (for development) or PostgreSQL (for production)
- pip (Python package manager)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```env
   # App settings
   DEBUG=True
   
   # Database
   DATABASE_NAME=eventnow_db
   
   # JWT
   SECRET_KEY=your-secret-key-here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 days
   
   # First admin user
   FIRST_ADMIN_EMAIL=admin@eventnow.com
   FIRST_ADMIN_PASSWORD=admin123
   FIRST_ADMIN_FULLNAME=Admin User
   ```

## Database Setup

For development, SQLite is used by default. The database will be created automatically when you first run the application.

For production, you can use PostgreSQL by setting the `DATABASE_URL` environment variable:
```
DATABASE_URL=postgresql://user:password@localhost:5432/eventnow_db
```

## Running the Application

1. Start the development server:
   ```bash
   uvicorn main:app --reload
   ```

2. The API will be available at `http://localhost:8000`
3. Interactive API documentation (Swagger UI) is available at `http://localhost:8000/api/docs`
4. Alternative documentation (ReDoc) is available at `http://localhost:8000/api/redoc`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get access token
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update current user profile
- `POST /api/auth/change-password` - Change password

### Events
- `GET /api/events/` - List all events
- `POST /api/events/` - Create a new event (Admin only)
- `GET /api/events/{event_id}` - Get event details
- `PUT /api/events/{event_id}` - Update an event
- `DELETE /api/events/{event_id}` - Delete an event

### Registrations
- `POST /api/registrations/` - Register for an event
- `GET /api/registrations/my-registrations` - Get user's registrations
- `DELETE /api/registrations/{registration_id}` - Cancel registration

### Comments
- `POST /api/comments/` - Add a comment to an event
- `GET /api/comments/event/{event_id}` - Get comments for an event
- `PUT /api/comments/{comment_id}` - Update a comment
- `DELETE /api/comments/{comment_id}` - Delete a comment

### Recommendations
- `GET /api/recommendations/events` - Get recommended events
- `GET /api/recommendations/similar-events/{event_id}` - Get similar events

## Testing

Run the test suite with:
```bash
pytest
```

## Deployment

For production deployment, consider using:
- Gunicorn with Uvicorn workers
- Nginx as a reverse proxy
- PostgreSQL as the database
- Environment variables for configuration

Example Gunicorn command:
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

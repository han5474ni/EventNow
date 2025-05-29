# EventNow Database Setup

This document provides instructions for setting up and managing the EventNow database.

## Prerequisites

- Python 3.8+
- PostgreSQL 13+
- pip (Python package manager)

## Setup Instructions

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd EventNow/Backend
   ```

2. **Create and activate a virtual environment** (recommended):
   ```bash
   # On Windows
   python -m venv venv
   .\venv\Scripts\activate
   
   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   - Copy `.env.example` to `.env` in the project root
   - Update the database credentials and other settings in `.env`

5. **Initialize the database**:
   ```bash
   # Run migrations and create initial data
   python setup_database.py
   
   # To reset the database (WARNING: This will delete all data!):
   # python setup_database.py --reset
   ```

## Database Schema

The database consists of the following main tables:

- `users` - User accounts and authentication
- `events` - Event listings
- `registrations` - Event registrations
- `comments` - Comments on events
- `password_resets` - Password reset tokens
- `email_verifications` - Email verification tokens

## Running Migrations

Alembic is used for database migrations. To create and apply migrations:

1. **Create a new migration**:
   ```bash
   alembic revision --autogenerate -m "Description of changes"
   ```

2. **Apply migrations**:
   ```bash
   alembic upgrade head
   ```

## Common Tasks

### Reset the database

To completely reset the database (WARNING: This will delete all data!):

```bash
python setup_database.py --reset
```

### Skip migrations

If you only want to create initial data without running migrations:

```bash
python setup_database.py --skip-migrations
```

## Database Backups

It's recommended to regularly back up your database. For PostgreSQL, you can use:

```bash
pg_dump -U your_username -d eventnow > eventnow_backup_$(date +%Y%m%d).sql
```

## Troubleshooting

### Connection Issues

- Ensure PostgreSQL is running
- Verify database credentials in `.env`
- Check if the database exists and the user has proper permissions

### Migration Issues

If you encounter migration issues:

1. Check the `alembic/versions` directory for any failed migrations
2. You can reset to a specific migration:
   ```bash
   alembic downgrade <revision>
   ```
3. Or reset all migrations (WARNING: This will delete all data!):
   ```bash
   python setup_database.py --reset
   ```

## Support

For additional help, please contact the development team.

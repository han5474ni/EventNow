from pydantic_settings import BaseSettings
from typing import Optional, List

class Settings(BaseSettings):
    # Application settings
    APP_NAME: str = "EventNow"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"  # Options: development, production
    FRONTEND_URL: str = "http://localhost:3000"
    REQUIRE_EMAIL_VERIFICATION: bool = False  # Set to True to require email verification
    
    # Database settings
    DATABASE_TYPE: str = "sqlite"  # Options: sqlite, postgresql
    DATABASE_NAME: str = "eventnow_db"
    DATABASE_USER: str = "postgres"
    DATABASE_PASSWORD: str = "postgres"
    DATABASE_HOST: str = "localhost"
    DATABASE_PORT: str = "5432"
    
    # JWT settings
    SECRET_KEY: str = "your-secret-key-here"  # Change this in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # CORS settings
    BACKEND_CORS_ORIGINS: List[str] = ["*"]
    
    # Email settings
    MAIL_USERNAME: str = "your-email@gmail.com"  # Replace with your actual Gmail address
    MAIL_PASSWORD: str = "your-app-password"     # Replace with your Gmail app password
    MAIL_FROM: str = "your-email@gmail.com"      # Replace with your Gmail address
    MAIL_FROM_NAME: str = "EventNow"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"          # Gmail's SMTP server
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    MAIL_USE_CREDENTIALS: bool = True
    MAIL_VALIDATE_CERTS: bool = True
    
    # First admin user (for initial setup)
    FIRST_ADMIN_EMAIL: str = "admin@eventnow.com"
    FIRST_ADMIN_PASSWORD: str = "admin123"  # Change this in production
    FIRST_ADMIN_FULLNAME: str = "Admin User"
    
    # Email notification settings are already configured above
    
    model_config = {
        "env_file": ".env",
        "case_sensitive": True,
        "env_file_encoding": "utf-8"
    }

# Create settings instance
settings = Settings()

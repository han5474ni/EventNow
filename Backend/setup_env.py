"""
Environment Setup Script

This script helps you create a .env file with the required configuration.
"""
import os
import sys
from pathlib import Path

def main():
    # Set console to UTF-8 encoding
    import sys
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    
    print("\n" + "=" * 60)
    print("EVENTNOW ENVIRONMENT SETUP".center(60))
    print("=" * 60 + "\n")
    
    env_path = Path(".env")
    
    if env_path.exists():
        print("[!] Warning: .env file already exists.")
        overwrite = input("Do you want to overwrite it? (y/N): ").strip().lower()
        if overwrite != 'y':
            print("Operation cancelled.")
            return
    
    print("\nEnter your configuration (press Enter to use default values):\n")
    
    # Database configuration
    print("\n[Database Configuration]")
    db_type = input(f"Database type (sqlite/postgresql) [sqlite]: ").strip().lower() or "sqlite"
    db_name = input(f"Database name [eventnow]: ").strip() or "eventnow"
    
    db_config = f"""# Database Configuration
DATABASE_TYPE={db_type}
DATABASE_NAME={db_name}
"""
    
    if db_type == 'postgresql':
        db_user = input("Database user [postgres]: ").strip() or "postgres"
        db_password = input("Database password: ").strip()
        db_host = input("Database host [localhost]: ").strip() or "localhost"
        db_port = input("Database port [5432]: ").strip() or "5432"
        
        db_config += f"""DATABASE_USER={db_user}
DATABASE_PASSWORD={db_password}
DATABASE_HOST={db_host}
DATABASE_PORT={db_port}
"""
    
    # JWT Configuration
    print("\n[JWT Configuration]")
    secret_key = input("Enter a secret key for JWT (leave empty to generate a random one): ").strip()
    if not secret_key:
        import secrets
        secret_key = secrets.token_urlsafe(32)
        print(f"Generated secret key: {secret_key}")
    
    jwt_config = f"""
# JWT Configuration
SECRET_KEY={secret_key}
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440  # 24 hours
"""
    # Email Configuration
    print("\n[Email Configuration]")
    print("Configure email settings for password reset and email verification.")
    smtp_server = input("SMTP server [smtp.example.com]: ").strip() or "smtp.example.com"
    smtp_port = input("SMTP port [587]: ").strip() or "587"
    smtp_username = input("SMTP username [your-email@example.com]: ").strip() or "your-email@example.com"
    smtp_password = input("SMTP password: ").strip() or "your-email-password"
    email_from = input("Sender email [no-reply@eventnow.com]: ").strip() or "no-reply@eventnow.com"
    
    email_config = f"""
# Email Configuration
SMTP_SERVER={smtp_server}
SMTP_PORT={smtp_port}
SMTP_USERNAME={smtp_username}
SMTP_PASSWORD={smtp_password}
EMAIL_FROM={email_from}
"""
    # Frontend and CORS
    print("\n[Frontend Configuration]")
    frontend_url = input("Frontend URL [http://localhost:3000]: ").strip() or "http://localhost:3000"
    
    frontend_config = f"""
# Frontend URL (for email links)
FRONTEND_URL={frontend_url}

# CORS Configuration
BACKEND_CORS_ORIGINS=["{frontend_url}"]
"""
    # Write to .env file
    env_content = f"""# EventNow Configuration
# This file contains sensitive information. Do not commit it to version control.

{db_config}{jwt_config}{email_config}{frontend_config}"""
    
    try:
        with open(env_path, 'w') as f:
            f.write(env_content)
        
        print("\n[+] .env file created successfully!")
        print(f"Location: {env_path.absolute()}")
        print("\n[!] Important: Add .env to your .gitignore file to prevent sensitive data from being committed.")
        
    except Exception as e:
        print(f"\n[-] Error creating .env file: {e}")
        print("Please check file permissions and try again.")
        sys.exit(1)

if __name__ == "__main__":
    main()

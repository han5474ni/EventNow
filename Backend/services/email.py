import logging
from fastapi import BackgroundTasks
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from typing import List, Dict, Any

from config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure FastMail
mail_config = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=settings.MAIL_USE_CREDENTIALS,
    VALIDATE_CERTS=settings.MAIL_VALIDATE_CERTS
)

async def send_email(
    email_to: List[EmailStr],
    subject: str,
    body: Dict[str, Any],
    template_name: str
):
    """Send an email using a template"""
    try:
        message = MessageSchema(
            subject=subject,
            recipients=email_to,
            template_body=body,
            subtype="html"
        )
        
        fm = FastMail(mail_config)
        await fm.send_message(message, template_name=template_name)
        logger.info(f"Email sent successfully to {email_to}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return False

async def send_password_reset_email(email: EmailStr, name: str, token: str):
    """Send password reset email"""
    reset_url = f"{settings.FRONTEND_URL}/reset-password/{token}"
    
    # Email content
    subject = "Reset Your Password - EventNow"
    body = {
        "name": name,
        "reset_url": reset_url,
        "valid_hours": 24
    }
    
    # Always log the reset URL for debugging purposes
    logger.info(f"Password reset URL for {email}: {reset_url}")
    
    # Send the actual email regardless of environment
    return await send_email(
        email_to=[email],
        subject=subject,
        body=body,
        template_name="password_reset.html"
    )

async def send_verification_email(email: EmailStr, name: str, token: str):
    """Send email verification link"""
    verify_url = f"{settings.FRONTEND_URL}/verify-email/{token}"
    
    # Email content
    subject = "Verify Your Email - EventNow"
    body = {
        "name": name,
        "verify_url": verify_url,
        "valid_hours": 48
    }
    
    # Always log the verification URL for debugging purposes
    logger.info(f"Email verification URL for {email}: {verify_url}")
    
    # Send the actual email regardless of environment
    return await send_email(
        email_to=[email],
        subject=subject,
        body=body,
        template_name="email_verification.html"
    )

async def send_welcome_email(email: EmailStr, name: str):
    """Send welcome email to new users"""
    login_url = f"{settings.FRONTEND_URL}/login"
    
    # Email content
    subject = "Welcome to EventNow!"
    body = {
        "name": name,
        "login_url": login_url
    }
    
    # Always log the welcome email for debugging purposes
    logger.info(f"Sending welcome email to {email}")
    
    # Send the actual email regardless of environment
    return await send_email(
        email_to=[email],
        subject=subject,
        body=body,
        template_name="welcome.html"
    )

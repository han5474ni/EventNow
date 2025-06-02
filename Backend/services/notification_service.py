import logging
from fastapi import BackgroundTasks
from services.email import send_email

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def send_event_notification_email(background_tasks: BackgroundTasks, event, recipients):
    """
    Send an email notification about a new event
    
    Args:
        background_tasks: FastAPI BackgroundTasks for async processing
        event: The event object
        recipients: List of email addresses to notify
    """
    subject = f"New Event: {event.title}"
    
    # Create HTML content
    html_content = f"""
    <h2>New Event: {event.title}</h2>
    <p><strong>Description:</strong> {event.description}</p>
    <p>
        <strong>When:</strong> {event.start_datetime.strftime('%Y-%m-%d %H:%M')} - 
        {event.end_datetime.strftime('%Y-%m-%d %H:%M')}
    </p>
    <p><strong>Where:</strong> {event.location}</p>
    <p><strong>Category:</strong> {event.category}</p>
    <a href="http://localhost:3000/events/{event.id}">View Event Details</a>
    """
    
    # Send to each recipient
    for recipient in recipients:
        try:
            background_tasks.add_task(
                send_email,
                [recipient],
                subject,
                {"content": html_content},
                "event_notification.html"
            )
            logger.info(f"Event notification email queued for {recipient}")
        except Exception as e:
            logger.error(f"Failed to queue event notification email for {recipient}: {str(e)}")

async def send_registration_notification_email(background_tasks: BackgroundTasks, registration):
    """
    Send an email notification about a new registration
    
    Args:
        background_tasks: FastAPI BackgroundTasks for async processing
        registration: The registration object
    """
    event = registration.event
    user = registration.user
    organizer_email = event.organizer.email if event.organizer else None
    
    if not organizer_email:
        logger.warning(f"No organizer email found for event {event.id}")
        return
    
    subject = f"New Registration: {event.title}"
    
    # Create HTML content
    html_content = f"""
    <h2>New Registration for {event.title}</h2>
    <p><strong>User:</strong> {user.full_name} ({user.email})</p>
    <p><strong>Registration Date:</strong> {registration.registration_date.strftime('%Y-%m-%d %H:%M')}</p>
    <p><strong>Status:</strong> {registration.status}</p>
    <a href="http://localhost:3000/events/{event.id}/registrations">View All Registrations</a>
    """
    
    try:
        background_tasks.add_task(
            send_email,
            [organizer_email],
            subject,
            {"content": html_content},
            "registration_notification.html"
        )
        logger.info(f"Registration notification email queued for {organizer_email}")
    except Exception as e:
        logger.error(f"Failed to queue registration notification email: {str(e)}")

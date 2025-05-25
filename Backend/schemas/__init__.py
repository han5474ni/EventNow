from .auth_schema import (
    Token,
    TokenData,
    UserBase as AuthUserBase,
    UserCreate as AuthUserCreate,
    UserLogin,
    UserInDB as AuthUserInDB,
    UserResponse as AuthUserResponse,
    PasswordResetRequest,
    PasswordReset,
    ChangePassword
)

from .user_schema import (
    UserRole,
    UserBase,
    UserCreate,
    UserUpdate,
    UserInDB,
    UserResponse,
    UserWithEvents
)

from .event_schema import (
    EventCategory,
    EventBase,
    EventCreate,
    EventUpdate,
    Event,
    EventWithOrganizer,
    EventDetail
)

from .comment_schema import (
    CommentBase,
    CommentCreate,
    CommentUpdate,
    Comment,
    CommentWithAuthor,
    CommentWithEvent
)

from .registration_schema import (
    RegistrationStatus,
    RegistrationBase,
    RegistrationCreate,
    RegistrationUpdate,
    Registration,
    RegistrationWithEvent,
    RegistrationWithUser
)

from .email_verification import (
    EmailVerificationRequest,
    EmailVerificationResponse
)

from .password_reset import (
    ForgotPassword,
    ResetPassword
)

from .login import (
    LoginRequest,
    LoginResponse
)

__all__ = [
    # Auth schemas
    'Token',
    'TokenData',
    'UserLogin',
    'PasswordResetRequest',
    'PasswordReset',
    'ChangePassword',
    'ForgotPassword',
    'ResetPassword',
    'EmailVerificationRequest',
    'EmailVerificationResponse',
    'LoginRequest',
    'LoginResponse',
    
    # User schemas
    'UserRole',
    'UserBase',
    'UserCreate',
    'UserUpdate',
    'UserInDB',
    'UserResponse',
    'UserWithEvents',
    
    # Event schemas
    'EventCategory',
    'EventBase',
    'EventCreate',
    'EventUpdate',
    'Event',
    'EventWithOrganizer',
    'EventDetail',
    
    # Comment schemas
    'CommentBase',
    'CommentCreate',
    'CommentUpdate',
    'Comment',
    'CommentWithAuthor',
    'CommentWithEvent',
    
    # Registration schemas
    'RegistrationStatus',
    'RegistrationBase',
    'RegistrationCreate',
    'RegistrationUpdate',
    'Registration',
    'RegistrationWithEvent',
    'RegistrationWithUser'
]
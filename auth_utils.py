"""
Authentication utilities and validation.
"""

import re
import logging
from functools import wraps
from flask import session, redirect, url_for, flash

logger = logging.getLogger(__name__)


def is_valid_email(email):
    """
    Validate email format.
    
    Args:
        email (str): Email address to validate
        
    Returns:
        bool: True if valid, False otherwise
    """
    if not email:
        return False
    
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(pattern, email) is not None


def is_strong_password(password):
    """
    Validate password strength.
    Requirements:
    - At least 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    - At least one special character (!@#$%^&*)
    
    Args:
        password (str): Password to validate
        
    Returns:
        tuple: (is_valid, message)
    """
    if not password:
        return False, "Password is required"
    
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not any(c.isupper() for c in password):
        return False, "Password must contain at least one uppercase letter"
    
    if not any(c.islower() for c in password):
        return False, "Password must contain at least one lowercase letter"
    
    if not any(c.isdigit() for c in password):
        return False, "Password must contain at least one number"
    
    special_chars = "!@#$%^&*"
    if not any(c in special_chars for c in password):
        return False, f"Password must contain at least one special character ({special_chars})"
    
    return True, "Password is strong"


def login_required(f):
    """
    Decorator to require login for a route.
    Redirects to login page if user is not authenticated.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "id_user" not in session:
            flash("You must be logged in to access this page", "warning")
            return redirect(url_for("auth.login"))
        return f(*args, **kwargs)
    return decorated_function


def user_owns_resource(resource_id_param="user_id"):
    """
    Decorator to check if user owns the resource.
    Prevents users from accessing other users' data.
    
    Args:
        resource_id_param (str): URL parameter name for the resource ID
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            resource_id = kwargs.get(resource_id_param)
            current_user_id = session.get("id_user")
            
            if resource_id != current_user_id:
                logger.warning(f"Unauthorized access attempt by user {current_user_id} to resource {resource_id}")
                flash("You don't have permission to access this resource", "error")
                return redirect(url_for("events.home"))
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator


__all__ = ["is_valid_email", "is_strong_password", "login_required", "user_owns_resource"]

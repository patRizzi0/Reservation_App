"""
Application with CRITICAL SECURITY FIXES only.
Maintains the simple original structure.
"""

import os
import logging
from functools import wraps
from flask import Flask, redirect, render_template, request, session, flash, url_for
from flask_wtf.csrf import CSRFProtect
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import text
from dotenv import load_dotenv
from connection import engine
from model.model_reservation import ReservationAlreadyExists, create_reservation, get_all_reservation, get_user_reservations
from model.model_evento import get_all_events, get_event_by_id
from model.model_seats import get_seats_by_event

load_dotenv()

app = Flask(__name__)

# 🔥 CRITICAL: Secret key from environment
app.secret_key = os.getenv("SECRET_KEY", "dev-key-change-in-production")
# 🔥 SECURITY: Session configuration
app.config["SESSION_PERMANENT"] = True
app.config["PERMANENT_SESSION_LIFETIME"] = 3600
app.config["SESSION_COOKIE_SECURE"] = False  # Set True only on HTTPS
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"


csrf = CSRFProtect(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# 🔥 CRITICAL: Complete decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "id_user" not in session:
            flash("You need to log in", "warning")
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    return decorated_function   

# 🔥 CRITICAL: Context processor - SELECT only safe columns
# Never delete the session here, just load the data
@app.context_processor
def inject_user():
    user = None
    if "id_user" in session:
        try:
            with engine.connect() as conn:
                result = conn.execute(
                    text("SELECT id_user, nome, cognome, email FROM users WHERE id_user = :id_user"),
                    {"id_user": session["id_user"]}
                ).fetchone()
            
            if result:
                # Convert Row to dict safely
                try:
                    user = dict(result._mapping) if hasattr(result, '_mapping') else dict(result)
                except:
                    user = {
                        "id_user": result[0],
                        "nome": result[1],
                        "cognome": result[2],
                        "email": result[3]
                    }
                #logger.debug(f"User loaded: {user.get('nome')} {user.get('cognome')}")
                
        except Exception as e:
            # Don't delete the session! Only log
            logger.error(f"Context processor error: {e}", exc_info=True)
    
    return {"current_user": user}


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        nome = request.form.get("nome", "").strip()
        cognome = request.form.get("cognome", "").strip()
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")
        password_confirm = request.form.get("password_confirm", "")
        
        # Client-side validation (double check for security)
        if not nome:
            flash("👤 Name required", "error")
            return redirect(url_for("register"))
        
        if not cognome:
            flash("👥 Surname required", "error")
            return redirect(url_for("register"))
        
        if not email:
            flash("📧 Email required", "error")
            return redirect(url_for("register"))
        
        if not password:
            flash("🔑 Password required", "error")
            return redirect(url_for("register"))
        
        if not password_confirm:
            flash("✓ Confirm password required", "error")
            return redirect(url_for("register"))
        
        if password != password_confirm:
            flash("❌ Passwords don't match", "error")
            return redirect(url_for("register"))
        
        try:
            conn = engine.connect()
            tx = conn.begin()
            try:
                existing = conn.execute(
                    text("SELECT id_user FROM users WHERE email = :email"),
                    {"email": email}
                ).fetchone()
                
                if existing:
                    tx.rollback()
                    conn.close()
                    flash(f"❌ Email {email} is already registered. Sign in or use a different email.", "error")
                    logger.warning(f"Registration attempt with existing email: {email}")
                    return redirect(url_for("register"))
                
                conn.execute(
                    text("""INSERT INTO users (nome, cognome, email, password_hash)
                        VALUES (:nome, :cognome, :email, :password_hash)"""),
                    {
                        "nome": nome,
                        "cognome": cognome,
                        "email": email,
                        "password_hash": generate_password_hash(password, method="scrypt")
                    }
                )
                tx.commit()
                conn.close()
                flash("✅ Registration completed! Sign in to your account.", "success")
                logger.info(f"User registered: {email}")
                return redirect(url_for("login"))
            except Exception as e:
                tx.rollback()
                conn.close()
                raise e
        except Exception as e:
            logger.error(f"Register error: {e}", exc_info=True)
            flash("⚠️ Error during registration. Try again.", "error")
            return redirect(url_for("register"))
    
    return render_template("pages/register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")

        
        # Client-side validation
        if not email:
            flash("📧 Email required", "error")
            return redirect(url_for("login"))
        
        if not password:
            flash("🔑 Password required", "error")
            return redirect(url_for("login"))
        
        try:
            conn = engine.connect()
            try:
                user = conn.execute(
                    text("SELECT id_user, nome, email, password_hash FROM users WHERE email = :email"),
                    {"email": email}
                ).fetchone()
            finally:
                conn.close()
            
            # Specific error message for each error
            if not user:
                flash("❌ Email not found. Check the email you entered or register.", "error")
                logger.warning(f"Login attempt with non-existent email: {email}")
                return redirect(url_for("login"))
            
            # Convert Row to dict
            user_dict = dict(user) if hasattr(user, 'keys') else user
            password_hash = user_dict.get('password_hash') if isinstance(user_dict, dict) else user[3]
            
            if not check_password_hash(password_hash, password):
                flash("❌ Wrong password. Try again or click 'Forgot password'.", "error")
                logger.warning(f"Failed login with wrong password: {email}")
                return redirect(url_for("login"))
            
            # ✅ Login successful
            user_id = user_dict.get('id_user') if isinstance(user_dict, dict) else user[0]
            user_name = user_dict.get('nome') if isinstance(user_dict, dict) else user[1]

            
            # Secure session creation
            session["id_user"] = user_id


            flash(f"✅ Welcome, {user_name}!", "success")

            logger.info(f"Login successful: {email} (ID: {user_id})")
            print("")
            print("")
            print("")
            
            
            return redirect(url_for("home"))
        
            
        except Exception as e:
            error_msg = str(e)
            logger.error(f"Login error: {error_msg}", exc_info=True)
            flash("⚠️ Server error during login. Try again later.", "error")
            return redirect(url_for("login"))
    
    return render_template("pages/login.html")


@app.route("/logout", methods=["POST"])
def logout():
    user_id = session.get("id_user")
    session.clear()
    session.modified = True  # Force session to be deleted
    logger.info(f"Logout: {user_id}")
    flash("Logout successful", "success")
    return redirect(url_for("home"))


@app.route("/profilo")
@login_required
def profilo():
    return render_template("pages/profilo.html")


@app.route("/home")
@app.route("/")
def home():
    events = get_all_events()
    return render_template("pages/home.html", events=events)


@app.route("/reservation/<int:id_evento>", methods=["GET", "POST"])
def reservation(id_evento):
    evento = get_event_by_id(id_evento)
    seats = get_seats_by_event(id_evento)

    if not evento:
        return render_template("pages/404.html"), 404


    return render_template(
        "pages/reservation.html",
        evento=evento,
        seats=seats,
        id_evento=id_evento
    )

@app.route("/confirm", methods=["POST"])
def confirm():
    if "id_user" not in session:
        return redirect(url_for("login"))

    user_id = session["id_user"]
    event_id = request.form.get("id_evento")
    seat_id = request.form.get("selected_seat_id")

    if not event_id or not seat_id:
        flash("Seleziona un posto prima di confermare.", "error")
        return redirect(url_for("home"))

    try:
        create_reservation(user_id, event_id, seat_id)
    except ReservationAlreadyExists:
        flash("Posto gia prenotato. Scegli un altro posto.", "error")
        return redirect(url_for("reservation", id_evento=event_id))
    except Exception as e:
        logger.error(f"Reservation error: {e}", exc_info=True)
        flash("Errore durante la prenotazione. Riprova.", "error")
        return redirect(url_for("reservation", id_evento=event_id))

    return render_template("pages/confirm.html", user_id=user_id, seat_id=seat_id, evento=get_event_by_id(event_id))

@app.route("/prenotazioni")
@login_required
def prenotazioni():
    user_id = session.get("id_user")
    reservations = get_user_reservations(user_id)
    return render_template("pages/prenotazioni.html", reservations=reservations)


if __name__ == "__main__":
    app.run(debug=False)

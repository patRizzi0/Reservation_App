"""
Event routes
"""

from flask import Blueprint, render_template
from model.model_evento import get_all_events, get_event_by_id
from model.model_seats import get_seats_by_event

events_bp = Blueprint("events", __name__)


@events_bp.route("/home")
@events_bp.route("/")
def home():
    events = get_all_events()
    return render_template("pages/home.html", events=events)


@events_bp.route("/reservation/<int:id_evento>")
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

"""
Profile routes - Protected
"""

from flask import Blueprint, render_template, redirect, url_for
from middleware import login_required
from model.model_reservation import get_all_reservation

profile_bp = Blueprint("profile", __name__)


@profile_bp.route("/profilo")
@login_required
def profilo():
    """🔥 CRITICO: Protetto con @login_required"""
    return render_template("pages/profilo.html")


@profile_bp.route("/prenotazioni")
@login_required
def prenotazioni():
    """🔥 CRITICO: Protetto con @login_required"""
    reservations = get_all_reservation()
    return render_template("pages/prenotazioni.html", reservations=reservations)

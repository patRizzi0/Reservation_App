from connection import app
from flask import render_template



from model.model_evento import get_all_events
from model.model_seats import get_seats_by_event


@app.route("/home")
def home():
    events = get_all_events()
    return render_template("pages/home.html", events=events)


@app.route("/reservation/<int:id_evento>")
def reservation(id_evento):
    seats = get_seats_by_event(id_evento)
    print("SEATS BACKEND:", seats)
    return render_template("pages/reservation.html", seats=seats, id_evento=id_evento)
































if __name__ == "__main__":
    app.run(debug=True)
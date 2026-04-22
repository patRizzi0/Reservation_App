from connection import engine
from connection import text


class ReservationAlreadyExists(Exception):
    """Raised when a seat is already reserved for the selected event."""


def get_all_reservation():
    """Ritorna TUTTE le prenotazioni (admin)"""
    query = text("""SELECT users.nome, users.cognome, events.nome_evento, seats.section, seats.row_number, seats.seat_number
    FROM reservations
    JOIN users ON reservations.id_user = users.id_user
    JOIN events ON reservations.id_evento = events.id_evento
    JOIN seats ON reservations.id_seat = seats.id_seat""")

    with engine.connect() as conn:
        result = conn.execute(query)
        return result.mappings().all()


def get_user_reservations(user_id):
    """Ritorna le prenotazioni di uno specifico utente"""
    query = text("""SELECT users.nome, users.cognome, events.nome_evento, seats.section, seats.row_number, seats.seat_number
    FROM reservations
    JOIN users ON reservations.id_user = users.id_user
    JOIN events ON reservations.id_evento = events.id_evento
    JOIN seats ON reservations.id_seat = seats.id_seat
    WHERE reservations.id_user = :user_id
    ORDER BY events.data_evento DESC""")

    with engine.connect() as conn:
        result = conn.execute(query, {"user_id": user_id})
        return result.mappings().all()


def create_reservation(user_id, event_id, seat_id):
    query = text("""
        INSERT INTO reservations (id_user, id_evento, id_seat)
        VALUES (:user_id, :event_id, :seat_id)
        ON CONFLICT (id_evento, id_seat) DO NOTHING
        RETURNING id_reservation
    """)

    with engine.begin() as conn:
        reservation_id = conn.execute(query, {
            "user_id": user_id,
            "event_id": event_id,
            "seat_id": seat_id
        }).scalar()

        if reservation_id is None:
            raise ReservationAlreadyExists("Posto gia prenotato")

        return reservation_id

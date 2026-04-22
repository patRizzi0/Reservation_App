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
    with engine.begin() as conn:
        locked_seat = conn.execute(text("""
            SELECT id_seat
            FROM seats
            WHERE id_seat = :seat_id
            FOR UPDATE
        """), {"seat_id": seat_id}).scalar()

        if locked_seat is None:
            raise ValueError("Posto non valido")

        existing_reservation = conn.execute(text("""
            SELECT 1
            FROM reservations
            WHERE id_evento = :event_id AND id_seat = :seat_id
            LIMIT 1
        """), {
            "event_id": event_id,
            "seat_id": seat_id
        }).scalar()

        if existing_reservation is not None:
            raise ReservationAlreadyExists("Posto gia prenotato")

        reservation_id = conn.execute(text("""
            INSERT INTO reservations (id_user, id_evento, id_seat)
            VALUES (:user_id, :event_id, :seat_id)
            RETURNING id_reservation
        """), {
            "user_id": user_id,
            "event_id": event_id,
            "seat_id": seat_id
        }).scalar()

        return reservation_id

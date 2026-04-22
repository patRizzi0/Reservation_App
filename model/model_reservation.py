from connection import engine
from connection import text

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
    query_select = text("""
        Select count(*) from reservations
        where id_evento = :event_id and id_seat = :seat_id
        for update
    """)


    with engine.begin() as conn:
        result = conn.execute(query_select, {
            "event_id": event_id,
            "seat_id": seat_id
        }).scalar()

        if result > 0:
            raise Exception("Posto già prenotato")
        else:
             query_ins = text("""
                INSERT INTO reservations (id_user, id_evento, id_seat)
                VALUES (:user_id, :event_id, :seat_id)
            """)
        conn.execute(query_ins, {
            "user_id": user_id,
            "event_id": event_id,
            "seat_id": seat_id
        })


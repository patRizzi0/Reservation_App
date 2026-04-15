from sqlalchemy import text
from connection import engine

def get_seats_by_event(id_evento):
    query = text("""
    SELECT
        s.id_seat,
        s.section AS section,
        s.row_number,
        s.seat_number,
        s.seat_type,
        CASE
            WHEN r.id_seat IS NOT NULL THEN 'occupato'
            ELSE 'disponibile'
        END AS status,
        CASE
            WHEN s.seat_type = 'vip' THEN 89.99
            WHEN s.seat_type = 'premium' THEN 49.99
            WHEN s.seat_type = 'disabili' THEN 19.99
            ELSE 29.99
        END AS price
    FROM seats s
    LEFT JOIN reservations r
        ON s.id_seat = r.id_seat
        AND r.id_evento = :id_evento
    ORDER BY s.section, s.row_number, s.seat_number
    """)

    with engine.connect() as conn:
        result = conn.execute(query, {"id_evento": id_evento})
        seats = [dict(row) for row in result.mappings().all()]

    return seats

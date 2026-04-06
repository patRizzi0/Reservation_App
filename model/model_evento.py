from connection import engine
from connection import text

def get_all_events():
    query = text("""SELECT
e.id_evento,
e.nome_evento,
e.data_evento,
e.luogo,
COUNT(s.id_seat) AS posti_disponibili
FROM events e
CROSS JOIN seats s
LEFT JOIN reservations r
ON r.id_evento = e.id_evento
AND r.id_seat = s.id_seat
WHERE r.id_seat IS NULL
GROUP BY
e.id_evento,
e.nome_evento,
e.data_evento,
e.luogo;""")
    

    with engine.connect() as conn:
        result = conn.execute(query)
        events = result.mappings().all()

    return events


def get_event_id():
    query = text("""SELECT id_evento from events""")

    with engine.connect() as conn:
        result = conn.execute(query)
        events_id = result.mappings().all()

    return events_id

"""
Script per inserire utenti di test e prenotazioni nel database
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from werkzeug.security import generate_password_hash

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

def insert_test_data():
    """Inserisce utenti e prenotazioni di test"""
    
    try:
        print("🚀 Inizio inserimento dati di test...\n")
        
        conn = engine.connect()
        tx = conn.begin()
        
        try:
            # ============================================
            # 1️⃣ INSERISCI UTENTI (ID 7, 8)
            # ============================================
            print("1️⃣ Inserimento utenti...")
            
            users_data = [
                {
                    "id_user": 7,
                    "nome": "Marco",
                    "cognome": "Rossi",
                    "email": "marco.rossi@email.com",
                    "password": "Marco123!@#"
                },
                {
                    "id_user": 8,
                    "nome": "Giulia",
                    "cognome": "Ferrari",
                    "email": "giulia.ferrari@email.com",
                    "password": "Giulia456!@#"
                }
            ]
            
            for user in users_data:
                password_hash = generate_password_hash(user["password"], method="scrypt")
                conn.execute(
                    text("""INSERT INTO users (id_user, nome, cognome, email, password_hash)
                            VALUES (:id_user, :nome, :cognome, :email, :password_hash)"""),
                    {
                        "id_user": user["id_user"],
                        "nome": user["nome"],
                        "cognome": user["cognome"],
                        "email": user["email"],
                        "password_hash": password_hash
                    }
                )
                print(f"   ✅ Utente creato: {user['nome']} {user['cognome']} (ID: {user['id_user']})")
            
            # ============================================
            # 2️⃣ VERIFICA EVENTI DISPONIBILI
            # ============================================
            print("\n2️⃣ Verifica eventi disponibili...")
            
            events = conn.execute(
                text("SELECT id_evento, nome_evento FROM events LIMIT 5")
            ).fetchall()
            
            if not events:
                print("   ❌ Nessun evento trovato! Crea prima degli eventi.")
                tx.rollback()
                conn.close()
                return
            
            print(f"   ✅ Trovati {len(events)} eventi:")
            for event in events:
                print(f"      - {event[1]} (ID: {event[0]})")
            
            # ============================================
            # 3️⃣ VERIFICA POSTI DISPONIBILI
            # ============================================
            print("\n3️⃣ Verifica posti disponibili...")
            
            available_seats = conn.execute(
                text("""SELECT id_seat, id_evento, section, row_number, seat_number 
                        FROM seats 
                        WHERE id_seat NOT IN (SELECT id_seat FROM reservations)
                        LIMIT 10""")
            ).fetchall()
            
            if not available_seats:
                print("   ❌ Nessun posto disponibile!")
                tx.rollback()
                conn.close()
                return
            
            print(f"   ✅ Trovati {len(available_seats)} posti disponibili")
            
            # ============================================
            # 4️⃣ INSERISCI PRENOTAZIONI
            # ============================================
            print("\n4️⃣ Inserimento prenotazioni...")
            
            # Marco prenota 2 posti per l'evento 1
            for i in range(2):
                if i < len(available_seats):
                    seat = available_seats[i]
                    conn.execute(
                        text("""INSERT INTO reservations (id_user, id_evento, id_seat)
                                VALUES (:id_user, :id_evento, :id_seat)"""),
                        {
                            "id_user": 7,
                            "id_evento": seat[1],
                            "id_seat": seat[0]
                        }
                    )
                    print(f"   ✅ Prenotazione Marco: Sezione {seat[2]}, Riga {seat[3]}, Posto {seat[4]}")
            
            # Giulia prenota 3 posti per l'evento 1
            for i in range(2, min(5, len(available_seats))):
                seat = available_seats[i]
                conn.execute(
                    text("""INSERT INTO reservations (id_user, id_evento, id_seat)
                            VALUES (:id_user, :id_evento, :id_seat)"""),
                    {
                        "id_user": 8,
                        "id_evento": seat[1],
                        "id_seat": seat[0]
                    }
                )
                print(f"   ✅ Prenotazione Giulia: Sezione {seat[2]}, Riga {seat[3]}, Posto {seat[4]}")
            
            # ============================================
            # 5️⃣ COMMIT E VERIFICA
            # ============================================
            tx.commit()
            conn.close()
            
            print("\n" + "="*50)
            print("✅ INSERIMENTO COMPLETATO CON SUCCESSO!")
            print("="*50)
            
            # Verifica finale
            conn = engine.connect()
            
            print("\n📋 RIEPILOGO DATI INSERITI:\n")
            
            # Mostra utenti
            users = conn.execute(
                text("SELECT id_user, nome, cognome, email FROM users WHERE id_user IN (7, 8)")
            ).fetchall()
            
            print("👥 Utenti:")
            for user in users:
                print(f"   - {user[1]} {user[2]} ({user[3]}) - ID: {user[0]}")
            
            # Mostra prenotazioni di Marco
            marco_reservations = conn.execute(
                text("""SELECT e.nome_evento, s.section, s.row_number, s.seat_number
                        FROM reservations r
                        JOIN events e ON r.id_evento = e.id_evento
                        JOIN seats s ON r.id_seat = s.id_seat
                        WHERE r.id_user = 7
                        ORDER BY e.nome_evento""")
            ).fetchall()
            
            print(f"\n📌 Prenotazioni Marco (ID: 7) - {len(marco_reservations)} posti:")
            for res in marco_reservations:
                print(f"   - {res[0]}: Sezione {res[1]}, Riga {res[2]}, Posto {res[3]}")
            
            # Mostra prenotazioni di Giulia
            giulia_reservations = conn.execute(
                text("""SELECT e.nome_evento, s.section, s.row_number, s.seat_number
                        FROM reservations r
                        JOIN events e ON r.id_evento = e.id_evento
                        JOIN seats s ON r.id_seat = s.id_seat
                        WHERE r.id_user = 8
                        ORDER BY e.nome_evento""")
            ).fetchall()
            
            print(f"\n📌 Prenotazioni Giulia (ID: 8) - {len(giulia_reservations)} posti:")
            for res in giulia_reservations:
                print(f"   - {res[0]}: Sezione {res[1]}, Riga {res[2]}, Posto {res[3]}")
            
            conn.close()
            
            print("\n🎉 Puoi accedere con:")
            print("   Email: marco.rossi@email.com")
            print("   Password: Marco123!@#")
            print("   oppure")
            print("   Email: giulia.ferrari@email.com")
            print("   Password: Giulia456!@#")
            
        except Exception as e:
            tx.rollback()
            conn.close()
            raise e
            
    except Exception as e:
        print(f"\n❌ ERRORE: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    insert_test_data()

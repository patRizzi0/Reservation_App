import psycopg2

DATABASE_URL = "postgresql://postgres:bLMsapfcMmPtZhLwQCJwNpWXGixNtFrv@mainline.proxy.rlwy.net:43404/railway"

files = ["drop.sql", "schema.sql", "seed.sql"]

conn = psycopg2.connect(DATABASE_URL)

for f in files:
    cur = conn.cursor()
    with open(f, "r") as file:
        cur.execute(file.read())
        conn.commit()
        cur.close()
        print(f"✓ {f} eseguito")

conn.close()
print("✅ Done!")
"""
Debug script to test login functionality
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from werkzeug.security import generate_password_hash, check_password_hash

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
print(f"Database URL: {DATABASE_URL}")

try:
    print("\n1️⃣ Testing database connection...")
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("✅ Connection successful!")
    
    print("\n2️⃣ Checking if 'users' table exists...")
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT EXISTS(
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'users'
                )
            """)
        ).fetchone()
        table_exists = result[0]
        if table_exists:
            print("✅ Users table exists!")
        else:
            print("❌ Users table does NOT exist!")
    
    print("\n3️⃣ Fetching all users...")
    with engine.connect() as conn:
        users = conn.execute(text("SELECT id_user, nome, email FROM users")).fetchall()
        if users:
            print(f"✅ Found {len(users)} users:")
            for user in users:
                print(f"   - {user['nome']} ({user['email']}) - ID: {user['id_user']}")
        else:
            print("❌ No users found!")
    
    print("\n4️⃣ Testing password hashing...")
    test_password = "TestPass123!"
    hashed = generate_password_hash(test_password, method="scrypt")
    print(f"   Original: {test_password}")
    print(f"   Hashed: {hashed}")
    
    is_valid = check_password_hash(hashed, test_password)
    print(f"✅ Password check: {is_valid}")
    
    print("\n✅ All tests passed!")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()

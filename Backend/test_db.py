from database import engine, Base

def test_connection():
    try:
        # Test the connection
        with engine.connect() as connection:
            print("✅ Successfully connected to the database!")
            
            # List all tables (if any exist) - using SQLAlchemy 2.0 text() for raw SQL
            from sqlalchemy import text
            result = connection.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema='public'"))
            tables = [row[0] for row in result]
            print(f"\nTables in the database: {tables or 'No tables found'}")
            
    except Exception as e:
        print(f"❌ Error connecting to the database: {e}")
        print("\nTroubleshooting:")
        print("1. Make sure PostgreSQL is running")
        print("2. Verify your database credentials in database.py")
        print("3. Check if the 'eventnow' database exists")
        print(f"4. Error details: {str(e)}")

if __name__ == "__main__":
    test_connection()

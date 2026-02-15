#!/usr/bin/env sh
set -e

echo "Checking database connection..."

# Use python to verify the DB port is open
python - << END
import socket
import time
while True:
    try:
        with socket.create_connection(('db', 3306), timeout=1):
            print("Database is reachable!")
            break
    except OSError:
        print("Database not ready yet, retrying in 2s...")
        time.sleep(2)
END

echo "Running Alembic migrations..."
alembic upgrade head

echo "Starting Uvicorn..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
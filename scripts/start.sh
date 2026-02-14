#!/usr/bin/env sh
set -e

echo "Waiting for database on db:3306..."

# This loop checks if the MySQL port is actually accepting connections
# It uses python's built-in socket library so you don't need to install 'nc' or 'mysql-client'
python3 << END
import socket
import time

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
while True:
    try:
        s.connect(('db', 3306))
        s.close()
        break
    except socket.error:
        time.sleep(1)
END

echo "Database is reachable! Proceeding..."

# Run migrations
echo "Running migrations..."
alembic upgrade head

# Start Uvicorn
echo "Starting Uvicorn..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
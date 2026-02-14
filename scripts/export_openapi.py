import json
import os
import sys

# Ensure the app module can be found
sys.path.append(os.getcwd())

# Set dummy environment variables to bypass validation during export
os.environ.setdefault("MYSQL_USER", "dummy")
os.environ.setdefault("MYSQL_PASSWORD", "dummy")
os.environ.setdefault("MYSQL_SERVER", "localhost")
os.environ.setdefault("MYSQL_DB", "dummy")
os.environ.setdefault("SECRET_KEY", "dummy_secret_key_for_export")
os.environ.setdefault("S3_BUCKET_NAME", "dummy_bucket")

from fastapi.openapi.utils import get_openapi

from app.main import app


def export_openapi():
    # Generate the OpenAPI schema
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        openapi_version=app.openapi_version,
        description=app.description,
        routes=app.routes,
    )

    # Save to file
    output_file = "csat_postman_collection.json"
    with open(output_file, "w") as f:
        json.dump(openapi_schema, f, indent=2)
    
    print(f"Successfully exported OpenAPI schema to {output_file}")
    print("Import this file into Postman to create your collection.")

if __name__ == "__main__":
    export_openapi()

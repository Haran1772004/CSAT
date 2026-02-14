import uuid
from typing import Optional

import boto3
from botocore.exceptions import ClientError, NoCredentialsError
from fastapi import UploadFile

from app.core.config import settings
from app.core.logging import logger


class S3Service:
    def __init__(self):
        self._client = None
        self.bucket_name = settings.S3_BUCKET_NAME

    @property
    def s3_client(self):
        """Lazy initialization of S3 client to prevent startup crashes."""
        if self._client is None:
            self._client = boto3.client(
                "s3",
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_REGION,
            )
        return self._client

    def upload_file(self, file: UploadFile) -> Optional[str]:
        """
        Uploads a file to S3 and returns the public URL.
        Renames the file to a UUID to avoid collisions and preserve privacy.
        """
        if not file.filename:
            return None

        file_extension = file.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"

        try:
            self.s3_client.upload_fileobj(
                file.file,
                self.bucket_name,
                unique_filename,
                ExtraArgs={"ContentType": file.content_type},
            )
            return f"https://{self.bucket_name}.s3.{settings.AWS_REGION}.amazonaws.com/{unique_filename}"
        except (ClientError, NoCredentialsError) as e:
            logger.error(f"Failed to upload file to S3: {e}")
            return None

s3_service = S3Service()

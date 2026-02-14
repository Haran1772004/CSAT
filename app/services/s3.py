import uuid
from typing import Optional

import boto3
from botocore.exceptions import ClientError
from fastapi import UploadFile

from app.core.config import settings
from app.core.logging import logger


class S3Service:
    def __init__(self):
        # boto3 will automatically check environment variables and IAM roles
        # if keys are not explicitly provided
        self.s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION,
        )
        self.bucket_name = settings.S3_BUCKET_NAME

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
            # Assuming public read or using presigned URLs?
            # Requirement says "Store only S3 URL".
            # Constructing URL manually for standard S3 bucket
            return f"https://{self.bucket_name}.s3.{settings.AWS_REGION}.amazonaws.com/{unique_filename}"
        except ClientError as e:
            logger.error(f"Failed to upload file to S3: {e}")
            return None

s3_service = S3Service()

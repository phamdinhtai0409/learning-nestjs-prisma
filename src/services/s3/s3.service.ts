import { Injectable } from "@nestjs/common";
import { S3 } from "aws-sdk";
import { ManagedUpload } from "aws-sdk/clients/s3";

import { GLOBAL_CONFIG } from "configs/global.config";

@Injectable()
export class S3Service {
  private s3: S3;
  constructor() {
    this.s3 = new S3({
      credentials: {
        accessKeyId: GLOBAL_CONFIG.aws.aws_access_key_id,
        secretAccessKey: GLOBAL_CONFIG.aws.aws_secret_access_key,
      }
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<ManagedUpload.SendData> {
    const params: S3.PutObjectRequest = {
      Bucket: GLOBAL_CONFIG.aws.s3.bucket,
      Key: file.originalname,
      Body: file.buffer,
      ACL: "public-read",
    };

    return this.s3.upload(params).promise();
  }
}

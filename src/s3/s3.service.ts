import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
config();

@Injectable()
export class S3Service {
  s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACC_KEY,
    secretAccessKey: process.env.S3_SECRET_ACC_KEY,
  });

  async s3upload(file: any) {
    try {
      if (file.mimetype !== 'image/jpeg') {
        return false;
      }
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${uuidv4()}.${file.mimetype.split('/')[1]}`,
        Body: file.buffer,
        ACL: 'public-read',
      };
      return await this.s3.upload(params).promise();
    } catch (e) {
      return false;
    }
  }
}

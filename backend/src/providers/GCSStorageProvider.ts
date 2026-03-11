import { Storage } from '@google-cloud/storage';
import { IStorageProvider } from './storage.interface.js';
// import dotenv from 'dotenv';

// dotenv.config();

export class GCSStorageProvider implements IStorageProvider {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    this.storage = new Storage({
      keyFilename: process.env.GCP_KEY_FILE_PATH,
      projectId: process.env.GCP_PROJECT_ID,
    });
    this.bucketName = process.env.GCP_BUCKET_NAME || '';
  }

  async generateUploadUrl(key: string, contentType: string): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(key);

    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType,
    });

    return url;
  }

  async getDownloadUrl(key: string): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(key);

    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    return url;
  }

  async deleteFile(key: string): Promise<void> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(key);
    await file.delete();
  }
}

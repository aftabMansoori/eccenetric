import { Storage } from '@google-cloud/storage';
import { IStorageProvider } from './storage.interface.js';

export class GCSStorageProvider implements IStorageProvider {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    const projectId = process.env.GCP_PROJECT_ID;
    const bucketName = process.env.GCP_BUCKET_NAME || '';

    // Vercel-friendly auth: store service account JSON in an env var (optionally base64-encoded).
    const json = process.env.GCP_SERVICE_ACCOUNT_JSON?.trim();
    const b64 = process.env.GCP_SERVICE_ACCOUNT_B64?.trim();

    if (json || b64) {
      const raw = json ?? Buffer.from(b64!, 'base64').toString('utf8');
      const creds = JSON.parse(raw) as {
        client_email?: string;
        private_key?: string;
        project_id?: string;
      };

      this.storage = new Storage({
        projectId: projectId || creds.project_id,
        credentials: {
          client_email: creds.client_email,
          private_key: creds.private_key?.replace(/\\n/g, '\n'),
        },
      });
    } else {
      // Local/dev fallback: point to a credentials file on disk.
      this.storage = new Storage({
        keyFilename: process.env.GCP_KEY_FILE_PATH,
        projectId,
      });
    }

    this.bucketName = bucketName;
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

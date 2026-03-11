export type AssetType = 'image' | 'video' | 'pdf' | 'other';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  mimeType: string;
  size: number;
  uploadDate: string;
  tags: string[];
  url: string; // Data URL or file URL
  thumbnailUrl?: string;
}

export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  error?: string;
}

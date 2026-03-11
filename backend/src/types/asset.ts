export enum AssetStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export interface Asset {
  id: string;
  originalName: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
  checksum?: string;
  status: AssetStatus;
  createdAt?: string;
  updatedAt?: string;
}

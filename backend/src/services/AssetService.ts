import { IAssetRepository } from '../repositories/AssetRepository.js';
import { IStorageProvider } from '../providers/storage.interface.js';
import { AssetStatus } from '../models/Asset.js';
import { v4 as uuidv4 } from 'uuid';

export class AssetService {
  constructor(
    private assetRepository: IAssetRepository,
    private storageProvider: IStorageProvider
  ) {}

  async prepareUpload(data: {
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    checksum?: string;
  }) {
    const id = uuidv4();
    const storageKey = `assets/${id}-${data.originalName}`;

    const asset = await this.assetRepository.create({
      id,
      originalName: data.originalName,
      storageKey,
      mimeType: data.mimeType,
      sizeBytes: data.sizeBytes,
      checksum: data.checksum,
      status: AssetStatus.PENDING,
    });

    const uploadUrl = await this.storageProvider.generateUploadUrl(
      storageKey,
      data.mimeType
    );

    return {
      asset,
      uploadUrl,
    };
  }

  async confirmUpload(id: string) {
    const asset = await this.assetRepository.findById(id);
    if (!asset) {
      throw new Error('Asset not found');
    }

    // In a real application, you might want to verify with GCS that the file exists
    // and potentially check the checksum.
    
    await this.assetRepository.updateStatus(id, AssetStatus.ACTIVE);
    return await this.assetRepository.findById(id);
  }

  async listAssets(filters: {
    mimeType?: string;
    minSize?: number;
    maxSize?: number;
    page?: number;
    limit?: number;
  }) {
    const limit = filters.limit || 10;
    const offset = ((filters.page || 1) - 1) * limit;

    return await this.assetRepository.findAll({
      ...filters,
      limit,
      offset,
    });
  }

  async getAsset(id: string) {
    const asset = await this.assetRepository.findById(id);
    if (!asset) {
      throw new Error('Asset not found');
    }
    return asset;
  }
}

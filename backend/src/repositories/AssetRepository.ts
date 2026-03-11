import { Asset, AssetStatus } from '../models/Asset.js';
import { Op } from 'sequelize';

export interface IAssetRepository {
  create(data: Partial<Asset>): Promise<Asset>;
  findById(id: string): Promise<Asset | null>;
  updateStatus(id: string, status: AssetStatus): Promise<void>;
  findAll(options: { 
    mimeType?: string, 
    minSize?: number, 
    maxSize?: number, 
    limit?: number, 
    offset?: number 
  }): Promise<{ rows: Asset[], count: number }>;
}

export class AssetRepository implements IAssetRepository {
  async create(data: Partial<Asset>): Promise<Asset> {
    return await Asset.create(data as any);
  }

  async findById(id: string): Promise<Asset | null> {
    return await Asset.findByPk(id);
  }

  async updateStatus(id: string, status: AssetStatus): Promise<void> {
    await Asset.update({ status }, { where: { id } });
  }

  async findAll(options: { 
    mimeType?: string, 
    minSize?: number, 
    maxSize?: number, 
    limit?: number, 
    offset?: number 
  }): Promise<{ rows: Asset[], count: number }> {
    const { mimeType, minSize, maxSize, limit = 10, offset = 0 } = options;
    const where: any = {};

    if (mimeType) {
      where.mimeType = mimeType;
    }

    if (minSize !== undefined || maxSize !== undefined) {
      where.sizeBytes = {};
      if (minSize !== undefined) where.sizeBytes[Op.gte] = minSize;
      if (maxSize !== undefined) where.sizeBytes[Op.lte] = maxSize;
    }

    return await Asset.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
  }
}

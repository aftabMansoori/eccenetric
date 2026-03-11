import { IStorageProvider } from '../providers/storage.interface.js';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../utils/SupaBase.util.js';
import { AssetStatus } from '../types/asset.js';

export class AssetService {
  constructor(
    private storageProvider: IStorageProvider
  ) { }

  async prepareUpload(data: {
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    checksum?: string;
  }) {
    const id = uuidv4();
    const storageKey = `assets/${id}-${data.originalName}`;

    const { data: asset, error } = await supabase
      .from('assets')
      .insert({
        id,
        originalName: data.originalName,
        storageKey,
        mimeType: data.mimeType,
        sizeBytes: data.sizeBytes,
        checksum: data.checksum || null,
        status: AssetStatus.PENDING,
      })
      .select()
      .single();

    if (error) throw error;

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
    const { data: asset, error } = await supabase
      .from('assets')
      .update({ status: AssetStatus.ACTIVE })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') throw new Error('Asset not found');
      throw error;
    }

    return asset;
  }

  async listAssets(filters: {
    mimeType?: string;
    minSize?: number;
    maxSize?: number;
    page?: number;
    limit?: number;
  }) {
    const limit = filters.limit || 10;
    const page = filters.page || 1;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('assets')
      .select('*', { count: 'exact' });

    if (filters.mimeType) {
      query = query.eq('mimeType', filters.mimeType);
    }
    if (filters.minSize) {
      query = query.gte('sizeBytes', filters.minSize);
    }
    if (filters.maxSize) {
      query = query.lte('sizeBytes', filters.maxSize);
    }

    const { data, count, error } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      items: data,
      total: count,
      page,
      limit,
    };
  }

  async getAsset(id: string) {
    const { data: asset, error } = await supabase
      .from('assets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') throw new Error('Asset not found');
      throw error;
    }
    return asset;
  }
}

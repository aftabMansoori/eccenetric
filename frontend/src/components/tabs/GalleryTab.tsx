import { useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { SearchFilter } from '../search-filter';
import { AssetGallery } from '../asset-gallery';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setFilters } from '../../store/slices/filterSlice';
import { useListAssetsQuery, useDeleteAssetMutation } from '../../store/api/assetApi';
import type { Asset } from '../../types/asset';
import type { SearchFilters } from '../search-filter';

export function GalleryTab() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);
  const { data, isLoading } = useListAssetsQuery({
    mimeType: filters.fileType !== 'all' ? filters.fileType : undefined,
    limit: 100,
  });
  const [deleteAsset] = useDeleteAssetMutation();

  const assets = data?.items ?? [];

  // Client-side filtering & sorting (search, tags, sort)
  const filteredAssets = useMemo(() => {
    let filtered = [...assets];

    if (filters.searchTerm) {
      const search = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (asset) =>
          asset.name.toLowerCase().includes(search) ||
          asset.tags.some((tag) => tag.toLowerCase().includes(search))
      );
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter((asset) =>
        filters.tags.every((tag) => asset.tags.includes(tag))
      );
    }

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date-desc':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case 'date-asc':
          return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return b.size - a.size;
        default:
          return 0;
      }
    });

    return filtered;
  }, [assets, filters]);

  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    assets.forEach((asset) => {
      asset.tags.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [assets]);

  const handleFiltersChange = useCallback((newFilters: SearchFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteAsset(id).unwrap();
      toast.success('Asset deleted');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete asset');
    }
  }, [deleteAsset]);

  const handleDownload = useCallback(async (asset: Asset) => {
    try {
      toast.info(`Preparing ${asset.name} for download...`);
      const link = document.createElement('a');
      link.href = asset.url;
      link.setAttribute('download', asset.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error('Failed to download asset');
    }
  }, []);

  return (
    <>
      <SearchFilter
        filters={filters}
        onFiltersChange={handleFiltersChange}
        availableTags={availableTags}
      />
      <AssetGallery
        assets={filteredAssets}
        onDelete={handleDelete}
        onDownload={handleDownload}
      />
    </>
  );
}

export { type SearchFilters };

import { useState, useEffect, useMemo } from 'react';
import { LayoutGrid, List, Upload as UploadIcon } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { UploadZone } from './components/upload-zone';
import { AssetGallery } from './components/asset-gallery';
import { AssetList } from './components/asset-list';
import { SearchFilter, SearchFilters } from './components/search-filter';
import type { Asset, UploadProgress } from './types/asset';
import { DAM_API_URL } from '../constants/api';

export default function App() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    fileType: 'all',
    sortBy: 'date-desc',
    tags: [],
  });

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${DAM_API_URL}/assets`, {
        params: {
          mimeType: filters.fileType !== 'all' ? filters.fileType : undefined,
          limit: 100,
        }
      });

      const mappedAssets: Asset[] = response.data.items.map((item: any) => ({
        id: item.id,
        name: item.originalName,
        type: getFileType(item.mimeType),
        mimeType: item.mimeType,
        size: item.sizeBytes,
        uploadDate: item.created_at || item.createdAt,
        tags: [], // Tags not yet implemented in backend
        url: `${DAM_API_URL}/assets/${item.id}/view`, // Placeholder endpoint for viewing
      }));

      setAssets(mappedAssets);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
      toast.error('Failed to load assets from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [filters.fileType]);

  const getFileType = (mimeType: string): Asset['type'] => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType === 'application/pdf') return 'pdf';
    return 'other';
  };

  const handleUpload = async (files: File[]) => {
    debugger
    const newUploads: UploadProgress[] = files.map((file) => ({
      fileId: crypto.randomUUID(), // Local temporary ID for tracking
      fileName: file.name,
      progress: 0,
      status: 'uploading' as const,
    }));

    setUploadProgress((prev) => [...prev, ...newUploads]);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const upload = newUploads[i];

      try {
        // Step 1: Get Upload Intent
        const intentResponse = await axios.post(`${DAM_API_URL}/assets/upload-intent`, {
          originalName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
        });

        const { asset: pendingAsset, uploadUrl } = intentResponse.data;

        // Step 2: Upload to GCS via Signed URL
        await axios.put(uploadUrl, file, {
          headers: {
            'Content-Type': file.type,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || file.size));
            setUploadProgress((prev) =>
              prev.map((u) =>
                u.fileId === upload.fileId
                  ? { ...u, progress: percentCompleted }
                  : u
              )
            );
          },
        });

        // Step 3: Confirm Upload
        const confirmResponse = await axios.post(`${DAM_API_URL}/assets/confirm/${pendingAsset.id}`);
        const finalAsset = confirmResponse.data;

        const newAsset: Asset = {
          id: finalAsset.id,
          name: finalAsset.originalName,
          type: getFileType(finalAsset.mimeType),
          mimeType: finalAsset.mimeType,
          size: finalAsset.sizeBytes,
          uploadDate: finalAsset.updated_at || finalAsset.createdAt,
          tags: [],
          url: `${DAM_API_URL}/assets/${finalAsset.id}/view`,
        };

        setAssets((prev) => [newAsset, ...prev]);

        setUploadProgress((prev) =>
          prev.map((u) =>
            u.fileId === upload.fileId
              ? { ...u, progress: 100, status: 'complete' }
              : u
          )
        );

        toast.success(`${file.name} uploaded successfully`);

        setTimeout(() => {
          setUploadProgress((prev) =>
            prev.filter((u) => u.fileId !== upload.fileId)
          );
        }, 2000);
      } catch (error) {
        console.error('Upload error:', error);
        setUploadProgress((prev) =>
          prev.map((u) =>
            u.fileId === upload.fileId
              ? {
                ...u,
                status: 'error',
                error: 'Failed to upload file',
              }
              : u
          )
        );
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  };

  const handleCancelUpload = (fileId: string) => {
    // In a real app, you'd cancel the axios request
    setUploadProgress((prev) => prev.filter((u) => u.fileId !== fileId));
    toast.info('Upload cancelled');
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${DAM_API_URL}/assets/${id}`);
      setAssets((prev) => prev.filter((a) => a.id !== id));
      toast.success('Asset deleted');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete asset');
    }
  };

  const handleDownload = async (asset: Asset) => {
    try {
      // In a real app, the backend should provide a direct download URL
      toast.info(`Preparing ${asset.name} for download...`);
      const link = document.createElement('a');
      link.href = asset.url; // This should be a direct URL or a proxy download URL
      link.setAttribute('download', asset.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error('Failed to download asset');
    }
  };

  // Filter and sort assets
  const filteredAssets = useMemo(() => {
    let filtered = [...assets];

    // Filter by search term
    if (filters.searchTerm) {
      const search = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (asset) =>
          asset.name.toLowerCase().includes(search) ||
          asset.tags.some((tag) => tag.toLowerCase().includes(search))
      );
    }

    // Filter by file type
    if (filters.fileType !== 'all') {
      filtered = filtered.filter((asset) => asset.type === filters.fileType);
    }

    // Filter by tags
    if (filters.tags.length > 0) {
      filtered = filtered.filter((asset) =>
        filters.tags.every((tag) => asset.tags.includes(tag))
      );
    }

    // Sort
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

  // Get all unique tags
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    assets.forEach((asset) => {
      asset.tags.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [assets]);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="space-y-2">
          <h1>Digital Asset Management</h1>
          <p className="text-muted-foreground">
            Upload, organize, and manage your digital assets
          </p>
        </header>

        <Tabs defaultValue="gallery" className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList>
              <TabsTrigger value="upload">
                <UploadIcon className="mr-2 h-4 w-4" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="gallery">
                <LayoutGrid className="mr-2 h-4 w-4" />
                Gallery
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="mr-2 h-4 w-4" />
                List
              </TabsTrigger>
            </TabsList>

            <div className="text-sm text-muted-foreground">
              {filteredAssets.length} of {assets.length} assets
            </div>
          </div>

          <TabsContent value="upload" className="space-y-6">
            <UploadZone
              onUpload={handleUpload}
              uploadProgress={uploadProgress}
              onCancelUpload={handleCancelUpload}
            />
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <SearchFilter
              filters={filters}
              onFiltersChange={setFilters}
              availableTags={availableTags}
            />
            <AssetGallery
              assets={filteredAssets}
              onDelete={handleDelete}
              onDownload={handleDownload}
            />
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            <SearchFilter
              filters={filters}
              onFiltersChange={setFilters}
              availableTags={availableTags}
            />
            <AssetList
              assets={filteredAssets}
              onDelete={handleDelete}
              onDownload={handleDownload}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

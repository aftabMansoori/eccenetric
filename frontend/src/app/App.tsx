import { useState, useEffect, useMemo } from 'react';
import { LayoutGrid, List, Upload as UploadIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { UploadZone } from './components/upload-zone';
import { AssetGallery } from './components/asset-gallery';
import { AssetList } from './components/asset-list';
import { SearchFilter, SearchFilters } from './components/search-filter';
import type { Asset, UploadProgress } from './types/asset';

const STORAGE_KEY = 'dam-assets';

export default function App() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    fileType: 'all',
    sortBy: 'date-desc',
    tags: [],
  });

  // Load assets from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedAssets = JSON.parse(stored);
        // Filter out assets with data URLs that may have been lost
        const validAssets = parsedAssets.filter((asset: Asset) => asset.url);
        setAssets(validAssets);
      } catch (error) {
        console.error('Failed to load assets:', error);
      }
    }
  }, []);

  // Save assets to localStorage whenever they change
  useEffect(() => {
    if (assets.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
    }
  }, [assets]);

  const getFileType = (mimeType: string): Asset['type'] => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType === 'application/pdf') return 'pdf';
    return 'other';
  };

  const handleUpload = async (files: File[]) => {
    const newUploads: UploadProgress[] = files.map((file) => ({
      fileId: crypto.randomUUID(),
      fileName: file.name,
      progress: 0,
      status: 'uploading' as const,
    }));

    setUploadProgress((prev) => [...prev, ...newUploads]);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const upload = newUploads[i];

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) =>
            prev.map((u) =>
              u.fileId === upload.fileId && u.progress < 90
                ? { ...u, progress: u.progress + 10 }
                : u
            )
          );
        }, 200);

        // Read file as data URL
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        clearInterval(progressInterval);

        // Generate mock tags based on file type
        const type = getFileType(file.type);
        const mockTags: string[] = [];
        if (type === 'image') mockTags.push('photo');
        if (type === 'video') mockTags.push('media');
        if (type === 'pdf') mockTags.push('document');

        const newAsset: Asset = {
          id: upload.fileId,
          name: file.name,
          type,
          mimeType: file.type,
          size: file.size,
          uploadDate: new Date().toISOString(),
          tags: mockTags,
          url: dataUrl,
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

        // Remove from progress after 2 seconds
        setTimeout(() => {
          setUploadProgress((prev) =>
            prev.filter((u) => u.fileId !== upload.fileId)
          );
        }, 2000);
      } catch (error) {
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
    setUploadProgress((prev) => prev.filter((u) => u.fileId !== fileId));
    toast.info('Upload cancelled');
  };

  const handleDelete = (id: string) => {
    const asset = assets.find((a) => a.id === id);
    setAssets((prev) => prev.filter((a) => a.id !== id));
    toast.success(`${asset?.name} deleted`);
  };

  const handleDownload = (asset: Asset) => {
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = asset.url;
    link.download = asset.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloading ${asset.name}`);
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

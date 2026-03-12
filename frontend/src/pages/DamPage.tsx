import { LayoutGrid, List, Upload as UploadIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { UploadTab } from '../components/tabs/UploadTab';
import { GalleryTab } from '../components/tabs/GalleryTab';
import { ListTab } from '../components/tabs/ListTab';
import { useListAssetsQuery } from '../store/api/assetApi';

export default function DamPage() {
  const { data } = useListAssetsQuery({ limit: 100 });
  const totalAssets = data?.items.length ?? 0;

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
              {totalAssets} assets
            </div>
          </div>

          <TabsContent value="upload" className="space-y-6">
            <UploadTab />
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <GalleryTab />
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            <ListTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

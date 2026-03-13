import { LayoutGrid, List, LogOut, Upload as UploadIcon, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { UploadTab } from '../components/tabs/UploadTab';
import { GalleryTab } from '../components/tabs/GalleryTab';
import { ListTab } from '../components/tabs/ListTab';
import { useListAssetsQuery } from '../store/api/assetApi';
import { useLogoutMutation } from '../store/api/authApi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearCredentials } from '../store/slices/authSlice';
import { useNavigate } from 'react-router';

export default function DamPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const { data } = useListAssetsQuery({ limit: 100 });
  const totalAssets = data?.items.length ?? 0;

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // ignore errors; we'll still clear local state
    } finally {
      dispatch(clearCredentials());
      navigate('/signin', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="space-y-2">
          <div className="flex items-center justify-between">
            <h1>Digital Asset Management</h1>
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user?.email ?? 'User'}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center px-3 text-xs font-medium hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
              >
                <LogOut className="mr-1.5 h-4 w-4" />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
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

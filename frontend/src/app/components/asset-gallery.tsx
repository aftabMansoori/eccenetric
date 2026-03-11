import { FileText, Video, Download, Trash2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { Asset } from '../types/asset';

interface AssetGalleryProps {
  assets: Asset[];
  onDelete: (id: string) => void;
  onDownload: (asset: Asset) => void;
}

export function AssetGallery({ assets, onDelete, onDownload }: AssetGalleryProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderThumbnail = (asset: Asset) => {
    if (asset.type === 'image') {
      return (
        <img
          src={asset.url}
          alt={asset.name}
          className="h-full w-full object-cover"
        />
      );
    }

    if (asset.type === 'video') {
      return (
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <Video className="h-12 w-12 text-muted-foreground" />
        </div>
      );
    }

    if (asset.type === 'pdf') {
      return (
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <FileText className="h-12 w-12 text-muted-foreground" />
        </div>
      );
    }

    return (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <FileText className="h-12 w-12 text-muted-foreground" />
      </div>
    );
  };

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <FileText className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="mb-2">No assets found</h3>
        <p className="text-sm text-muted-foreground">
          Upload files to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {assets.map((asset) => (
        <Card key={asset.id} className="overflow-hidden">
          <div className="aspect-square overflow-hidden">
            {renderThumbnail(asset)}
          </div>
          <div className="p-4 space-y-3">
            <div>
              <h4 className="truncate mb-1">{asset.name}</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{formatFileSize(asset.size)}</span>
                <span>•</span>
                <span>{formatDate(asset.uploadDate)}</span>
              </div>
            </div>
            {asset.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {asset.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onDownload(asset)}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(asset.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

import { FileText, Image, Video, Download, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { Asset } from '../types/asset';

interface AssetListProps {
  assets: Asset[];
  onDelete: (id: string) => void;
  onDownload: (asset: Asset) => void;
}

export function AssetList({ assets, onDelete, onDownload }: AssetListProps) {
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getIcon = (type: Asset['type']) => {
    switch (type) {
      case 'image':
        return <Image className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'pdf':
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <FileText className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="mb-2">No assets found</h3>
        <p className="text-sm text-muted-foreground">
          Upload files or adjust your filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {assets.map((asset) => (
        <div
          key={asset.id}
          className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded bg-muted">
            {getIcon(asset.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="truncate mb-1">{asset.name}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {asset.type.toUpperCase()}
              </Badge>
              <span>{formatFileSize(asset.size)}</span>
              <span>•</span>
              <span>{formatDate(asset.uploadDate)}</span>
            </div>
          </div>

          {asset.tags.length > 0 && (
            <div className="hidden md:flex flex-wrap gap-1 max-w-xs">
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
              onClick={() => onDownload(asset)}
            >
              <Download className="h-4 w-4" />
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
      ))}
    </div>
  );
}

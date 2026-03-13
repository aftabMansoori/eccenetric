import { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import type { UploadProgress } from '../types/asset';

interface UploadZoneProps {
  onUpload: (files: File[]) => void;
  uploadProgress: UploadProgress[];
  onCancelUpload: (fileId: string) => void;
}

const ACCEPTED_FILE_TYPES = {
  'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
  'video/*': ['.mp4', '.mov', '.avi', '.webm'],
  'application/pdf': ['.pdf'],
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function UploadZone({ onUpload, uploadProgress, onCancelUpload }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateFiles = (files: File[]): { valid: File[]; errors: string[] } => {
    const valid: File[] = [];
    const newErrors: string[] = [];

    files.forEach((file) => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        newErrors.push(`${file.name}: File size exceeds 50MB`);
        return;
      }

      // Check file type
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isPdf = file.type === 'application/pdf';

      if (!isImage && !isVideo && !isPdf) {
        newErrors.push(`${file.name}: Unsupported file type`);
        return;
      }

      valid.push(file);
    });

    return { valid, errors: newErrors };
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const { valid, errors: validationErrors } = validateFiles(files);

      setErrors(validationErrors);
      if (valid.length > 0) {
        onUpload(valid);
      }
    },
    [onUpload]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const { valid, errors: validationErrors } = validateFiles(files);

      setErrors(validationErrors);
      if (valid.length > 0) {
        onUpload(valid);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed p-12 text-center transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-primary/10 p-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="mb-1">Drop files here or click to upload</h3>
            <p className="text-sm text-muted-foreground">
              Supports images, videos, and PDFs (max 50MB)
            </p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*,video/*,application/pdf"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Button asChild>
              <span>Select Files</span>
            </Button>
          </label>
        </div>
      </Card>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
            >
              <span>{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setErrors(errors.filter((_, i) => i !== index))}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm">Uploading Files</h3>
          {uploadProgress.map((upload) => (
            <Card key={upload.fileId} className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{upload.fileName}</span>
                    {upload.status === 'complete' && (
                      <Badge variant="default">Complete</Badge>
                    )}
                    {upload.status === 'error' && (
                      <Badge variant="destructive">Failed</Badge>
                    )}
                  </div>
                  {upload.status === 'uploading' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCancelUpload(upload.fileId)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {upload.status === 'uploading' && (
                  <Progress value={upload.progress} />
                )}
                {upload.status === 'error' && upload.error && (
                  <p className="text-sm text-destructive">{upload.error}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import { useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { UploadZone } from '../upload-zone';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  addUploads,
  updateProgress,
  markComplete,
  markError,
  removeUpload,
  cancelUpload,
} from '../../store/slices/uploadSlice';
import {
  useCreateUploadIntentMutation,
  useConfirmUploadMutation,
} from '../../store/api/assetApi';
import type { UploadProgress } from '../../types/asset';

export function UploadTab() {
  const dispatch = useAppDispatch();
  const uploadProgress = useAppSelector((state) => state.upload.uploads);
  const [createUploadIntent] = useCreateUploadIntentMutation();
  const [confirmUpload] = useConfirmUploadMutation();

  const handleUpload = useCallback(async (files: File[]) => {
    const newUploads: UploadProgress[] = files.map((file) => ({
      fileId: crypto.randomUUID(),
      fileName: file.name,
      progress: 0,
      status: 'uploading' as const,
    }));

    dispatch(addUploads(newUploads));

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const upload = newUploads[i];

      try {
        // Step 1: Get Upload Intent
        const intentResult = await createUploadIntent({
          originalName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
        }).unwrap();

        const { uploadUrl, asset: pendingAsset } = intentResult;

        // Step 2: Upload to GCS via Signed URL
        await axios.put(uploadUrl, file, {
          headers: { 'Content-Type': file.type },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || file.size)
            );
            dispatch(updateProgress({ fileId: upload.fileId, progress: percentCompleted }));
          },
        });

        // Step 3: Confirm Upload
        await confirmUpload(pendingAsset.id).unwrap();

        dispatch(markComplete(upload.fileId));
        toast.success(`${file.name} uploaded successfully`);

        // Remove from progress after 2 seconds
        setTimeout(() => {
          dispatch(removeUpload(upload.fileId));
        }, 2000);
      } catch (error) {
        console.error('Upload error:', error);
        dispatch(markError({ fileId: upload.fileId, error: 'Failed to upload file' }));
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  }, [dispatch, createUploadIntent, confirmUpload]);

  const handleCancelUpload = useCallback((fileId: string) => {
    dispatch(cancelUpload(fileId));
    toast.info('Upload cancelled');
  }, [dispatch]);

  return (
    <UploadZone
      onUpload={handleUpload}
      uploadProgress={uploadProgress}
      onCancelUpload={handleCancelUpload}
    />
  );
}

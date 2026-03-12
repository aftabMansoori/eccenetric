import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UploadProgress } from '../../types/asset';

interface UploadState {
  uploads: UploadProgress[];
}

const initialState: UploadState = {
  uploads: [],
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    addUploads(state, action: PayloadAction<UploadProgress[]>) {
      state.uploads.push(...action.payload);
    },
    updateProgress(state, action: PayloadAction<{ fileId: string; progress: number }>) {
      const upload = state.uploads.find((u) => u.fileId === action.payload.fileId);
      if (upload) {
        upload.progress = action.payload.progress;
      }
    },
    markComplete(state, action: PayloadAction<string>) {
      const upload = state.uploads.find((u) => u.fileId === action.payload);
      if (upload) {
        upload.progress = 100;
        upload.status = 'complete';
      }
    },
    markError(state, action: PayloadAction<{ fileId: string; error: string }>) {
      const upload = state.uploads.find((u) => u.fileId === action.payload.fileId);
      if (upload) {
        upload.status = 'error';
        upload.error = action.payload.error;
      }
    },
    removeUpload(state, action: PayloadAction<string>) {
      state.uploads = state.uploads.filter((u) => u.fileId !== action.payload);
    },
    cancelUpload(state, action: PayloadAction<string>) {
      state.uploads = state.uploads.filter((u) => u.fileId !== action.payload);
    },
  },
});

export const {
  addUploads,
  updateProgress,
  markComplete,
  markError,
  removeUpload,
  cancelUpload,
} = uploadSlice.actions;

export default uploadSlice.reducer;

# Frontend Refactoring: Redux Toolkit, RTK Query, Pages & Routing

Refactor [App.tsx](file:///d:/Projects/Eccentric%20Assignment/frontend/src/app/App.tsx) (currently 313 lines with all state, handlers, API calls, and UI) into a clean architecture with Redux Toolkit for state, RTK Query for API calls, React Router for routing, and a page-based component structure.

All required packages (`@reduxjs/toolkit`, `react-redux`, `react-router`, `axios`) are already installed.

## Proposed Changes

### Redux Store

#### [NEW] [store.ts](file:///d:/Projects/Eccentric%20Assignment/frontend/src/store/store.ts)
- `configureStore` with RTK Query API middleware and slices for upload progress + filters

#### [NEW] [hooks.ts](file:///d:/Projects/Eccentric%20Assignment/frontend/src/store/hooks.ts)
- Typed `useAppDispatch` and `useAppSelector` hooks

---

### RTK Query API

#### [NEW] [assetApi.ts](file:///d:/Projects/Eccentric%20Assignment/frontend/src/store/api/assetApi.ts)
- `createApi` with `fetchBaseQuery` pointing at `DAM_API_URL`
- Endpoints:
  - [listAssets](file:///d:/Projects/Eccentric%20Assignment/backend/src/services/AssetService.ts#64-102) (query) — `GET /assets` with filter params, replaces [fetchAssets()](file:///d:/Projects/Eccentric%20Assignment/frontend/src/app/App.tsx#24-53) in App.tsx
  - [getAsset](file:///d:/Projects/Eccentric%20Assignment/backend/src/services/AssetService.ts#103-116) (query) — `GET /assets/:id`
  - [deleteAsset](file:///d:/Projects/Eccentric%20Assignment/backend/src/services/AssetService.ts#117-131) (mutation) — `DELETE /assets/:id`, invalidates list cache
  - `createUploadIntent` (mutation) — `POST /assets/upload-intent`
  - [confirmUpload](file:///d:/Projects/Eccentric%20Assignment/backend/src/services/AssetService.ts#48-63) (mutation) — `POST /assets/confirm/:id`, invalidates list cache

---

### Redux Slices

#### [NEW] [uploadSlice.ts](file:///d:/Projects/Eccentric%20Assignment/frontend/src/store/slices/uploadSlice.ts)
- State: `uploadProgress: UploadProgress[]`
- Reducers: `addUploads`, `updateProgress`, `markComplete`, `markError`, `removeUpload`, `cancelUpload`
- Replaces all `setUploadProgress(...)` calls in App.tsx

#### [NEW] [filterSlice.ts](file:///d:/Projects/Eccentric%20Assignment/frontend/src/store/slices/filterSlice.ts)
- State: [SearchFilters](file:///d:/Projects/Eccentric%20Assignment/frontend/src/app/components/search-filter.tsx#14-20) (`searchTerm`, `fileType`, `sortBy`, `tags`)
- Reducers: `setFilters`, `resetFilters`
- Replaces `useState<SearchFilters>(...)` in App.tsx

---

### Pages & Routing

#### [NEW] [DamPage.tsx](file:///d:/Projects/Eccentric%20Assignment/frontend/src/pages/DamPage.tsx)
- Composes `Tabs` with `UploadTab`, `GalleryTab`, `ListTab`
- Reads asset count from RTK Query hook for the header
- Contains the page header ("Digital Asset Management")

#### [MODIFY] [App.tsx](file:///d:/Projects/Eccentric%20Assignment/frontend/src/app/App.tsx)
- Becomes a lightweight shell: just `<Routes>` with `<Route path="/" element={<DamPage />} />` and `<Route path="/dam" element={<DamPage />} />`

#### [MODIFY] [main.tsx](file:///d:/Projects/Eccentric%20Assignment/frontend/src/main.tsx)
- Wrap `<App />` with `<Provider store={store}>` and `<BrowserRouter>`

---

### Tab Content Components

#### [NEW] [UploadTab.tsx](file:///d:/Projects/Eccentric%20Assignment/frontend/src/app/components/tabs/UploadTab.tsx)
- Contains [handleUpload](file:///d:/Projects/Eccentric%20Assignment/frontend/src/app/App.tsx#65-156) logic (3-step: intent → GCS upload → confirm)
- Uses `useAppDispatch` to manage upload progress slice
- Uses RTK Query mutations (`createUploadIntent`, [confirmUpload](file:///d:/Projects/Eccentric%20Assignment/backend/src/services/AssetService.ts#48-63))
- Uses raw `axios.put` for the GCS signed-URL upload (not going through RTK Query since it's a direct-to-GCS call)
- Renders `<UploadZone />`

#### [NEW] [GalleryTab.tsx](file:///d:/Projects/Eccentric%20Assignment/frontend/src/app/components/tabs/GalleryTab.tsx)
- Uses `useListAssetsQuery` from RTK Query
- Uses filter slice from Redux for [SearchFilter](file:///d:/Projects/Eccentric%20Assignment/frontend/src/app/components/search-filter.tsx#27-133)
- Contains [handleDelete](file:///d:/Projects/Eccentric%20Assignment/frontend/src/app/App.tsx#163-173) and [handleDownload](file:///d:/Projects/Eccentric%20Assignment/frontend/src/app/App.tsx#174-188) handlers
- Renders `<SearchFilter />` + `<AssetGallery />`

#### [NEW] [ListTab.tsx](file:///d:/Projects/Eccentric%20Assignment/frontend/src/app/components/tabs/ListTab.tsx)
- Same pattern as `GalleryTab` but renders `<AssetList />`

---

### Types

#### [MODIFY] [asset.ts](file:///d:/Projects/Eccentric%20Assignment/frontend/src/app/types/asset.ts)
- Stays in place (no move needed since components already reference this path)
- Add `ApiAsset` interface representing the raw backend response shape for mapping

---

### Existing Components (Unchanged)
- [upload-zone.tsx](file:///d:/Projects/Eccentric%20Assignment/frontend/src/app/components/upload-zone.tsx) — no changes needed, remains a presentational component
- [asset-gallery.tsx](file:///d:/Projects/Eccentric%20Assignment/frontend/src/app/components/asset-gallery.tsx) — no changes needed
- [asset-list.tsx](file:///d:/Projects/Eccentric%20Assignment/frontend/src/app/components/asset-list.tsx) — no changes needed
- [search-filter.tsx](file:///d:/Projects/Eccentric%20Assignment/frontend/src/app/components/search-filter.tsx) — no changes needed

## Verification Plan

### Build Verification
- Run `npm run build` in the frontend directory — must succeed with zero TypeScript errors

### Manual Verification
1. Start both frontend (`npm run dev` in frontend/) and backend (`npm run dev` in backend/)
2. Navigate to `http://localhost:5173/` — should render the DAM page with tabs
3. Navigate to `http://localhost:5173/dam` — should render the same DAM page
4. **Upload Tab**: Drop/select a file → should show progress bar → toast on success → asset appears in Gallery
5. **Gallery Tab**: Assets should load from backend, filter by type, search by name, delete works
6. **List Tab**: Same data as Gallery but in list view

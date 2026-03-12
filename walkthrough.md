# Walkthrough: Frontend Refactoring

## What Changed

[App.tsx](file:///d:/Projects/Eccentric%20Assignment/frontend/src/app/App.tsx) went from **313 lines** (all state, handlers, API calls, UI) → **12 lines** (routing shell).

### New File Structure

```
frontend/src/
├── main.tsx                        ← Provider + BrowserRouter wrapper
├── app/
│   ├── App.tsx                     ← Routes only (/, /dam)
│   ├── components/
│   │   ├── tabs/
│   │   │   ├── UploadTab.tsx       ← Upload logic + UploadZone
│   │   │   ├── GalleryTab.tsx      ← Filters + AssetGallery
│   │   │   └── ListTab.tsx         ← Filters + AssetList
│   │   ├── upload-zone.tsx         (unchanged)
│   │   ├── asset-gallery.tsx       (unchanged)
│   │   ├── asset-list.tsx          (unchanged)
│   │   └── search-filter.tsx       (unchanged)
│   └── types/asset.ts              (unchanged)
├── pages/
│   └── DamPage.tsx                 ← Page composition (header + tabs)
├── store/
│   ├── store.ts                    ← configureStore
│   ├── hooks.ts                    ← useAppDispatch, useAppSelector
│   ├── api/
│   │   └── assetApi.ts             ← RTK Query (5 endpoints)
│   └── slices/
│       ├── uploadSlice.ts          ← Upload progress state
│       └── filterSlice.ts          ← Search/filter state
└── constants/api.ts                (unchanged)
```

### Redux Toolkit
- **Store** configured with RTK Query middleware + 2 slices
- **Upload slice**: [addUploads](file:///d:/Projects/Eccentric%20Assignment/frontend/src/store/slices/uploadSlice.ts#16-19), [updateProgress](file:///d:/Projects/Eccentric%20Assignment/frontend/src/store/slices/uploadSlice.ts#19-25), [markComplete](file:///d:/Projects/Eccentric%20Assignment/frontend/src/store/slices/uploadSlice.ts#25-32), [markError](file:///d:/Projects/Eccentric%20Assignment/frontend/src/store/slices/uploadSlice.ts#32-39), [removeUpload](file:///d:/Projects/Eccentric%20Assignment/frontend/src/store/slices/uploadSlice.ts#39-42), [cancelUpload](file:///d:/Projects/Eccentric%20Assignment/frontend/src/store/slices/uploadSlice.ts#42-45)
- **Filter slice**: [setFilters](file:///d:/Projects/Eccentric%20Assignment/frontend/src/store/slices/filterSlice.ts#15-18), [resetFilters](file:///d:/Projects/Eccentric%20Assignment/frontend/src/store/slices/filterSlice.ts#18-21)

### RTK Query
- [listAssets](file:///d:/Projects/Eccentric%20Assignment/backend/src/services/AssetService.ts#64-102) — `GET /assets` with auto-caching and cache tags
- [getAsset](file:///d:/Projects/Eccentric%20Assignment/backend/src/services/AssetService.ts#103-116) — `GET /assets/:id`
- [deleteAsset](file:///d:/Projects/Eccentric%20Assignment/backend/src/services/AssetService.ts#117-131) — `DELETE /assets/:id` (invalidates list cache)
- `createUploadIntent` — `POST /assets/upload-intent`
- [confirmUpload](file:///d:/Projects/Eccentric%20Assignment/backend/src/services/AssetService.ts#48-63) — `POST /assets/confirm/:id` (invalidates list cache)

### Routing
- `/` and `/dam` both render [DamPage](file:///d:/Projects/Eccentric%20Assignment/frontend/src/pages/DamPage.tsx#8-60)
- Catch-all redirects to `/`

## Build Verification

```
✓ 1767 modules transformed
✓ built in 3.93s — 0 errors
```

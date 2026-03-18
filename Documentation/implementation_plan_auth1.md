# Auth Interceptors & 401 Handling

Implement a centralized Axios client with interceptors to manage authentication headers and handle unauthorized responses globally.

## Proposed Changes

### Frontend - API Client

#### [NEW] [client.ts](file:///d:/Projects/Eccentric%20Assignment/frontend/src/api/client.ts)
- Create an axios instance `apiClient` with `baseURL: DAM_API_URL`.
- **Request Interceptor**: Retrieve `dam_access_token` from `localStorage` and add it as a `Bearer` token to the `Authorization` header.
- **Response Interceptor**: Check for `401` status. If found:
  - Dispatch [clearCredentials](file:///d:/Projects/Eccentric%20Assignment/frontend/src/store/slices/authSlice.ts#28-34) (will need access to store or a manual localStorage clear + window redirect).
  - Redirect to `/signin`.

### Frontend - RTK Query Integration

#### [NEW] [axiosBaseQuery.ts](file:///d:/Projects/Eccentric%20Assignment/frontend/src/store/api/axiosBaseQuery.ts)
- Implement a custom `baseQuery` for RTK Query that uses the `apiClient` from `client.ts`. This ensures RTK Query benefits from the axios interceptors.

#### [MODIFY] [assetApi.ts](file:///d:/Projects/Eccentric%20Assignment/frontend/src/store/api/assetApi.ts)
- Replace `fetchBaseQuery` with `axiosBaseQuery`.
- Simplify endpoints as baseUrl and headers are now handled by the client.

#### [MODIFY] [authApi.ts](file:///d:/Projects/Eccentric%20Assignment/frontend/src/store/api/authApi.ts)
- Replace `fetchBaseQuery` with `axiosBaseQuery`.

### Frontend - Components

#### [MODIFY] [UploadTab.tsx](file:///d:/Projects/Eccentric%20Assignment/frontend/src/app/components/tabs/UploadTab.tsx)
- Ensure the direct GCS upload (`axios.put`) either:
  - Uses the regular `axios` import (to avoid interceptors).
  - OR the interceptor in `client.ts` is configured to only target our own API URL.

## Verification Plan

### Manual Verification
1. **Auth Header**: Perform any asset operation (list/upload) and verify in Network tab that `Authorization: Bearer ...` is present.
2. **401 Handling**:
   - Manually delete the token from `localStorage` or wait for it to expire/invalidate it on backend.
   - Perform an action that triggers a 401.
   - Verify the app redirects to `/signin`.
3. **GCS Upload**: Verify that file uploads still work and DO NOT send the `Authorization` header to Google APIs.

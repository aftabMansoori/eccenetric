import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { DAM_API_URL } from '../../constants/api';
import type { Asset, AssetType } from '../../types/asset';

// Raw shape returned by the backend
interface ApiAsset {
  id: string;
  original_name: string;
  storage_key: string;
  mime_type: string;
  size_bytes: number;
  checksum: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ListAssetsResponse {
  items: ApiAsset[];
  total: number | null;
  page: number;
  limit: number;
}

interface ListAssetsParams {
  mimeType?: string;
  minSize?: number;
  maxSize?: number;
  page?: number;
  limit?: number;
}

interface UploadIntentRequest {
  originalName: string;
  mimeType: string;
  sizeBytes: number;
}

interface UploadIntentResponse {
  asset: ApiAsset;
  uploadUrl: string;
}

function getFileType(mimeType: string): AssetType {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType === 'application/pdf') return 'pdf';
  return 'other';
}

function mapApiAsset(item: ApiAsset): Asset {
  return {
    id: item.id,
    name: item.original_name,
    type: getFileType(item.mime_type),
    mimeType: item.mime_type,
    size: item.size_bytes,
    uploadDate: item.created_at,
    tags: [],
    url: `${DAM_API_URL}/assets/${item.id}/view`,
  };
}

export const assetApi = createApi({
  reducerPath: 'assetApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${DAM_API_URL}/assets` }),
  tagTypes: ['Asset'],
  endpoints: (builder) => ({
    listAssets: builder.query<{ items: Asset[]; total: number | null; page: number; limit: number }, ListAssetsParams | void>({
      query: (params) => ({
        url: '/',
        params: params ?? { limit: 100 },
      }),
      transformResponse: (response: ListAssetsResponse) => ({
        items: response.items.map(mapApiAsset),
        total: response.total,
        page: response.page,
        limit: response.limit,
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.items.map(({ id }) => ({ type: 'Asset' as const, id })),
            { type: 'Asset', id: 'LIST' },
          ]
          : [{ type: 'Asset', id: 'LIST' }],
    }),

    getAsset: builder.query<Asset, string>({
      query: (id) => `/${id}`,
      transformResponse: (response: ApiAsset) => mapApiAsset(response),
      providesTags: (_result, _error, id) => [{ type: 'Asset', id }],
    }),

    deleteAsset: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Asset', id },
        { type: 'Asset', id: 'LIST' },
      ],
    }),

    createUploadIntent: builder.mutation<UploadIntentResponse, UploadIntentRequest>({
      query: (body) => ({
        url: '/upload-intent',
        method: 'POST',
        body,
      }),
    }),

    confirmUpload: builder.mutation<ApiAsset, string>({
      query: (id) => ({
        url: `/confirm/${id}`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Asset', id: 'LIST' }],
    }),
  }),
});

export const {
  useListAssetsQuery,
  useGetAssetQuery,
  useDeleteAssetMutation,
  useCreateUploadIntentMutation,
  useConfirmUploadMutation,
} = assetApi;

export { mapApiAsset };
export type { ApiAsset, UploadIntentResponse };

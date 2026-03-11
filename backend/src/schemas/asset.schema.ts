import { z } from 'zod';

export const UploadIntentSchema = z.object({
  originalName: z.string().min(1),
  mimeType: z.string().min(1),
  sizeBytes: z.number().positive(),
  checksum: z.string().optional(),
});

export const ListAssetsSchema = z.object({
  mimeType: z.string().optional(),
  minSize: z.coerce.number().nonnegative().optional(),
  maxSize: z.coerce.number().nonnegative().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
});

export const ConfirmUploadSchema = z.object({
  id: z.string().uuid(),
});

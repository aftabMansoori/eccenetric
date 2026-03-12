import { z } from 'zod';

export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

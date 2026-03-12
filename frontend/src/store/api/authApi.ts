import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { DAM_API_URL } from '../../constants/api';

interface AuthRequest {
  email: string;
  password: string;
}

interface AuthUser {
  id: string;
  email: string;
  [key: string]: any;
}

interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

interface SignInResponse {
  user: AuthUser;
  session: AuthSession;
}

interface SignUpResponse {
  message: string;
  user: AuthUser;
  session: AuthSession | null;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${DAM_API_URL}/auth`,
  }),
  endpoints: (builder) => ({
    signIn: builder.mutation<SignInResponse, AuthRequest>({
      query: (body) => ({
        url: '/signin',
        method: 'POST',
        body,
      }),
    }),
    signUp: builder.mutation<SignUpResponse, AuthRequest>({
      query: (body) => ({
        url: '/signup',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useSignInMutation, useSignUpMutation } = authApi;
export type { AuthUser, AuthSession, SignInResponse, SignUpResponse };

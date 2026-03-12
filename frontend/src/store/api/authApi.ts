import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';
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
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    signIn: builder.mutation<SignInResponse, AuthRequest>({
      query: (body) => ({
        url: '/auth/signin',
        method: 'POST',
        body,
      }),
    }),
    signUp: builder.mutation<SignUpResponse, AuthRequest>({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useSignInMutation, useSignUpMutation } = authApi;
export type { AuthUser, AuthSession, SignInResponse, SignUpResponse };

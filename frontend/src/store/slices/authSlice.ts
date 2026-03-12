import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser } from '../api/authApi';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

const token = localStorage.getItem('dam_access_token');

const initialState: AuthState = {
  user: null,
  token,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: AuthUser; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('dam_access_token', action.payload.token);
    },
    clearCredentials(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('dam_access_token');
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;

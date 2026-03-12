import { supabase } from '../utils/SupaBase.util.js';

export class AuthService {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signOut(accessToken: string) {
    const { error } = await supabase.auth.signOut({
      scope: 'global',
    });

    if (error) throw error;
    return { success: true };
  }

  async getUser(token: string) {
    const { data, error } = await supabase.auth.getUser(token);

    if (error) throw error;
    return data.user;
  }
}

import { api } from './api';
import type {
  AuthResponse,
  AuthUser,
} from './types';

export const authApi = {
  login: (email: string, password: string) =>
    api<AuthResponse>('/auth/login', { method: 'POST', body: { email, password }, token: null }),
  register: (name: string, email: string, password: string) =>
    api<AuthResponse>('/auth/register', {
      method: 'POST',
      body: { name, email, password },
      token: null,
    }),
  me: (token: string) => api<AuthUser>('/auth/me', { token, skipAuthReset: true }),
};

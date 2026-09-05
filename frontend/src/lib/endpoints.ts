import { api } from './api';
import type {
  AuthResponse,
  AuthUser,
  Concert,
  ConcertStats,
  CreateConcertInput,
  HistoryEntry,
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

export const concertsApi = {
  list: () => api<Concert[]>('/concerts'),
  stats: () => api<ConcertStats>('/concerts/stats'),
  create: (input: CreateConcertInput) => api<Concert>('/concerts', { method: 'POST', body: input }),
  remove: (id: string) => api<{ id: string }>(`/concerts/${id}`, { method: 'DELETE' }),
};

export const reservationsApi = {
  reserve: (concertId: string) =>
    api<{ id: string }>('/reservations', { method: 'POST', body: { concertId } }),
  cancel: (concertId: string) =>
    api<{ concertId: string; cancelled: boolean }>(`/reservations/${concertId}`, {
      method: 'DELETE',
    }),
  myHistory: () => api<HistoryEntry[]>('/reservations/me/history'),
  allHistory: () => api<HistoryEntry[]>('/reservations/history'),
};

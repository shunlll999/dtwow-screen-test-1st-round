export type Role = 'ADMIN' | 'USER';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface Concert {
  id: string;
  name: string;
  description: string;
  totalSeats: number;
  reservedSeats: number;
}

export interface ConcertStats {
  totalSeats: number;
  reserved: number;
  cancelled: number;
}

export type ReservationAction = 'RESERVE' | 'CANCEL';

export interface HistoryEntry {
  id: string;
  action: ReservationAction;
  concertId: string | null;
  concertName: string;
  createdAt: string;
  user?: { id: string; name: string; email: string };
}

export interface CreateConcertInput {
  name: string;
  description: string;
  totalSeats: number;
}

export type Role = 'ADMIN' | 'SELLER' | 'BUYER';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  phone?: string;
  role: Role;
  originalRole?: Role;
  isBanned?: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: Role;
  originalRole?: Role;
  token: string;
  message: string;
}

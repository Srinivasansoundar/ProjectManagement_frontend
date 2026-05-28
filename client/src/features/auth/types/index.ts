export type UserRole = 'admin' | 'manager' | 'developer'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user_info: User
}

export interface AuthState {
  user: User | null
}


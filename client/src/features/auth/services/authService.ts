import axiosInstance from '../../../lib/auth'
import type { AuthResponse, LoginCredentials } from '../types'

const API_URLs = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post(API_URLs.LOGIN, credentials)
    return response.data
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post(API_URLs.LOGOUT)
  }
}

export default authService

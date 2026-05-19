import axiosInstance from '../../../lib/axios'

interface CreateUserPayload {
  name: string
  email: string
  password: string
  role: 'admin' | 'manager' | 'developer'
}

interface User {
  id: string
  name: string
  email: string
  role: string
}

const userService = {
  createUser: async (userData: CreateUserPayload): Promise<User> => {
    const response = await axiosInstance.post('/user', userData)
    return response.data
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get('/users')
    return response.data
  },

  getUserById: async (userId: string): Promise<User> => {
    const response = await axiosInstance.get(`/user/${userId}`)
    return response.data
  },

  updateUser: async (userId: string, userData: Partial<CreateUserPayload>): Promise<User> => {
    const response = await axiosInstance.put(`/user/${userId}`, userData)
    return response.data
  },
}

export default userService

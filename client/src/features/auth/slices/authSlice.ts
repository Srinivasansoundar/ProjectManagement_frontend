import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, User } from '../types'
import { AUTH_KEYS } from '../../../config/constant'
import authService from '../services/authService'

const userInfoStr = localStorage.getItem(AUTH_KEYS.USER)
let user: User | null = null

try {
  if (userInfoStr) {
    user = JSON.parse(userInfoStr)
  }
} catch (error) {
  console.error("Error parsing user info from local storage", error)
}

const initialState: AuthState = {
  user: user,
}

// Create async thunk for logout
export const logoutAsync = createAsyncThunk(
  'auth/logoutAsync',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout()
      return true
    } catch (error) {
      console.error("Logout API error:", error)
      // Don't reject - still clear local state even if API fails
      return true
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.user = null
      localStorage.removeItem(AUTH_KEYS.TOKEN)
      localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(AUTH_KEYS.USER)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(logoutAsync.fulfilled, (state) => {
      state.user = null
      localStorage.removeItem(AUTH_KEYS.TOKEN)
      localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(AUTH_KEYS.USER)
    })
  }
})

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer

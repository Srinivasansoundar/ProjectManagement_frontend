import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '../features/auth/slices/authSlice'
// import cartReducer from '../features/cart/slices/cartSlice'

export const rootReducer = combineReducers({
  auth: authReducer,
    // add new feature slices here
})
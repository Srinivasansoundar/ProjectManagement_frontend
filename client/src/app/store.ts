import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from './rootReducer'
// import { middleware } from './middleware'

export const store = configureStore({
    reducer: rootReducer,
    //   middleware: (getDefault) => getDefault().concat(middleware),
})

// Inferred types — derive from the store, don't write them manually
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
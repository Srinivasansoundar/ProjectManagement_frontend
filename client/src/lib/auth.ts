import axios from 'axios'
import { ENV } from '../config/env'
import { AUTH_KEYS } from '../config/constant'

// axios.create() creates a reusable Axios object with predefined configuration.
const axiosInstance = axios.create({
    baseURL: ENV.API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add a request interceptor
// Runs before every request to add the Authorization header if a token is available

// config = {
//    method: 'get',
//    url: '/users',
//    baseURL: 'http://localhost:8000',
//    headers: {},
// }


axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(AUTH_KEYS.TOKEN)
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Track refresh token request to avoid multiple simultaneous refresh calls
let refreshPromise: Promise<any> | null = null


// Problem Without This

// Suppose:

// 5 API calls happen simultaneously
// access token expired

// Without protection:

// all 5 call /refresh
// creates race conditions


// Add a response interceptor
axiosInstance.interceptors.response.use(
    // if the status code is 2xx, this function will be called
    (response) => {
        return response
    },
    // if the status code is not 2xx, this function will be called
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && error.response?.data?.message === 'Token expired' && !originalRequest._retry) {
            originalRequest._retry = true
// original._retry is a custom property we add to the request config to track if we've 
// already tried refreshing for this request. This prevents infinite loops of trying 
// to refresh and retrying the original request if the refresh also fails with 401.
//Request fails with 401
// Refresh token request happens
// Refresh also fails with 401
// Interceptor again tries refresh
// Again fails
// Infinite loop forever
            try {
                // If refresh is already in progress, wait for it
                if (!refreshPromise) {
                    refreshPromise = (async () => {
                        const refreshToken = localStorage.getItem(AUTH_KEYS.REFRESH_TOKEN)
                        if (!refreshToken) {
                            throw new Error('No refresh token available')
                        }

                        const response = await axios.post(`${ENV.API_URL}/auth/refresh`, {
                            refreshToken,
                        })

                        const { accessToken, refreshToken: newRefreshToken } = response.data

                        localStorage.setItem(AUTH_KEYS.TOKEN, accessToken)
                        localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, newRefreshToken)

                        return { accessToken, refreshToken: newRefreshToken }
                    })()
                }

                const { accessToken } = await refreshPromise

                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`
                return axiosInstance(originalRequest)
            } catch (refreshError) {
                // Refresh failed, clear tokens and redirect to login
                localStorage.removeItem(AUTH_KEYS.TOKEN)
                localStorage.removeItem(AUTH_KEYS.USER)
                localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN)
                refreshPromise = null
                return Promise.reject(refreshError)
            } finally {
                refreshPromise = null
            }
        }

        if (error.response && error.response.status === 401) {
            // Handle other unauthorized errors
            localStorage.removeItem(AUTH_KEYS.TOKEN)
            localStorage.removeItem(AUTH_KEYS.USER)
            localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN)
        }

        return Promise.reject(error)
    }
)

export default axiosInstance

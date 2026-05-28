import axios from "axios";
import { ENV } from "../config/env";
import { AUTH_KEYS } from "../config/constant";

const axiosInstance = axios.create({
    baseURL: ENV.API_URL_PROJECTS,
    headers: {
        'Content-Type': 'application/json',
    },
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token')
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
let refreshPromise: Promise<any> | null = null
axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && error.response?.data?.message === 'Token expired' && !originalRequest._retry) {
            originalRequest._retry = true
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

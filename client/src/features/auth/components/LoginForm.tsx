import React, { useState } from 'react'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { setCredentials } from '../slices/authSlice'
import authService from '../services/authService'
import { AUTH_KEYS } from '../../../config/constant'
import { Loader2 } from 'lucide-react'

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validationError, setValidationError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const dispatch = useAppDispatch()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')
    setError(null)

    if (!email || !password) {
      setValidationError('Please fill in all fields.')
      return
    }

    setIsLoading(true)
    try {
      const data = await authService.login({ email, password })
      
      // Store in local storage directly
      localStorage.setItem(AUTH_KEYS.TOKEN, data.access_token)
      localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, data.refresh_token)
      localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(data.user_info))
      
      // Only keep the user in the Redux store
      dispatch(setCredentials(data.user_info))

    } catch (err: any) {
      if (err.response && err.response.data.detail) {
        setError(err.response.data.detail)
      } else {
        setError('An unexpected error occurred during login')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white px-8 py-10 shadow-2xl rounded-2xl border border-gray-100">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-sm text-gray-500 mt-2">Please enter your credentials to login.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        {validationError && (
          <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-100">
            <p className="text-sm text-amber-700 font-medium">{validationError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm

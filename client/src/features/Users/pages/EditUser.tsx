import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AlertCircle, Check, Loader, ArrowLeft } from 'lucide-react'
import userService from '../../Dashboard/services/userService'

interface User {
  id: string
  name: string
  email: string
  role: string
}

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [id])

  const fetchUser = async () => {
    if (!id) {
      setError('User ID is missing')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const userData = await userService.getUserById(id)
      setUser(userData)
      setFormData({
        name: userData.name,
        email: userData.email,
      })
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to fetch user'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !user) return

    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      await userService.updateUser(id, formData)
      setSuccess(true)
      setTimeout(() => {
        navigate('/admin/users')
      }, 2000)
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to update user'
      setError(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="animate-spin text-blue-600" size={40} />
          <span className="text-gray-600">Loading user...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/admin/users')}
            className="flex items-center gap-2 mb-6 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={18} />
            Back to Users
          </button>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={40} />
            <p className="text-red-700 text-lg">{error || 'User not found'}</p>
            <button
              onClick={() => navigate('/admin/users')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Return to Users
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/admin/users')}
          className="flex items-center gap-2 mb-6 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={18} />
          Back to Users
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Edit User</h1>
          <p className="text-gray-600 mt-2">Update user information</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-green-700">User updated successfully! Redirecting...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
          {/* Read-only fields */}
          <div className="mb-6 pb-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information (Read-only)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-2">
                  User ID
                </label>
                <input
                  type="text"
                  id="id"
                  value={user.id}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed outline-none"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="role"
                    value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Editable fields */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Information</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              {submitting ? 'Updating...' : 'Update User'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              disabled={submitting}
              className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-300 text-gray-900 font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditUser
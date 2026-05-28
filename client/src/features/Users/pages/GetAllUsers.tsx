import React, { useEffect, useState } from 'react'
import { Trash2, Edit2, Loader, ArrowLeft } from 'lucide-react'
// import userService from '../../Dashboard/services/userService'
import userService from '../services/userServices'
import { useNavigate } from 'react-router-dom'
interface User {
  id: string
  name: string
  email: string
  role: string
}

const GetAllUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const navigate = useNavigate()
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await userService.getAllUsers()
      setUsers(data)
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to fetch users'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }

    setDeletingId(userId)
    try {
      // Call delete endpoint when available
      await userService.deleteUser(userId)
      setUsers(users.filter(user => user.id !== userId))
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to delete user'
      alert(errorMsg)
    } finally {
      setDeletingId(null)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'manager':
        return 'bg-blue-100 text-blue-800'
      case 'developer':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">        <button
          onClick={() => navigate('/admin')}
          className="mb-6 flex items-center gap-2 px-4 py-2 text-gray-700 bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
        >
          <ArrowLeft size={18} />
          Back
        </button>        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">View and manage all system users</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchUsers}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="animate-spin text-blue-600" size={40} />
            <span className="ml-3 text-gray-600">Loading users...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">No users found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Edit user"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={deletingId === user.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50"
                          title="Delete user"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  )
}

export default GetAllUsers

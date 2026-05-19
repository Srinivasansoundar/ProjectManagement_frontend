import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../../app/store'
import { logoutAsync } from '../../auth/slices/authSlice'
import { LogOut, UserPlus, Users } from 'lucide-react'

const AdminDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await dispatch(logoutAsync())
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <UserPlus size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Create User</h3>
                <p className="text-sm text-gray-600">Add new users to the system</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/create-user')}
              className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Create New User
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">View Users</h3>
                <p className="text-sm text-gray-600">Manage and view all users</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/users')}
              className="w-full mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              View All Users
            </button>
          </div>

          
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

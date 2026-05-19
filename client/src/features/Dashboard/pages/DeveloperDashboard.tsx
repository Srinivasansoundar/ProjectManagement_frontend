import React from 'react'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../../app/store'
import { logoutAsync } from '../../auth/slices/authSlice'
import { LogOut } from 'lucide-react'

const DeveloperDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useDispatch<AppDispatch>()

  const handleLogout = async () => {
    await dispatch(logoutAsync())
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Developer Dashboard</h1>
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

        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">My Tasks</h2>
            <p className="text-gray-500">Developer tickets and pull requests will be displayed here.</p>
        </div>
      </div>
    </div>
  )
}

export default DeveloperDashboard

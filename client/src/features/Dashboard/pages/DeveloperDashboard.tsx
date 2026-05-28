import React from 'react'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../../app/store'
import { logoutAsync } from '../../auth/slices/authSlice'
import { LogOut, CheckSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const DeveloperDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await dispatch(logoutAsync())
  }

  const handleNavigateToTasks = () => {
    navigate('/developer/tasks')
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={handleNavigateToTasks}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-300 transition-all text-left"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <CheckSquare size={24} className="text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">My Tasks</h2>
            </div>
            <p className="text-gray-500">View and manage all tasks assigned to you</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeveloperDashboard

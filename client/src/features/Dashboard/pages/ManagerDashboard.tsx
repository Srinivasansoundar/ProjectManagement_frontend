import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../../app/store'
import { logoutAsync } from '../../auth/slices/authSlice'
import { LogOut, FolderKanban, ChevronRight, Loader2 } from 'lucide-react'
import projectService from '../../Projects/services/projectService'
import type { ProjectResponse } from '../../Projects/types'

const ManagerDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  
  const [projects, setProjects] = useState<ProjectResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.id) return
      try {
        setLoading(true)
        const data = await projectService.getProjectsByManager(user.id)
        setProjects(data)
      } catch (err: any) {
        console.error('Failed to fetch projects', err)
        setError(err.response?.data?.message || 'Failed to fetch your projects')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProjects()
  }, [user?.id])

  const handleLogout = async () => {
    await dispatch(logoutAsync())
  }

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200'
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'on_hold': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'planning': return 'bg-purple-100 text-purple-700 border-purple-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
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

        <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FolderKanban size={24} className="text-indigo-600" />
                Assigned Projects
            </h2>
            <p className="text-gray-500 text-sm mt-1">Select a project to manage its tasks</p>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
                <p>{error}</p>
            </div>
        )}

        {loading ? (
            <div className="flex justify-center items-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Loader2 size={40} className="animate-spin text-indigo-500" />
            </div>
        ) : projects.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FolderKanban size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Projects Assigned</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    You have not been assigned to manage any projects yet. When an admin assigns a project to you, it will appear here.
                </p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                    <div 
                        key={project.id}
                        onClick={() => navigate(`/manager/projects/${project.id}/tasks`)}
                        className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all cursor-pointer group hover:-translate-y-1 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                {project.name}
                            </h3>
                            <span className={`text-xs px-2.5 py-1 rounded-full border ${getStatusColor(project.status)}`}>
                                {project.status.replace('_', ' ')}
                            </span>
                        </div>
                        
                        <p className="text-gray-500 text-sm mb-6 line-clamp-2 min-h-[40px]">
                            {project.description || 'No description provided.'}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                            <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                                Manage Tasks
                            </span>
                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <ChevronRight size={18} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  )
}

export default ManagerDashboard

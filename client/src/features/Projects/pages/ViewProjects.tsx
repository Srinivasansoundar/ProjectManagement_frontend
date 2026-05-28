import React from 'react'
import ProjectList from '../components/ProjectList'
import { Plus, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ViewProjects: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/admin')}
          className="mb-6 flex items-center gap-2 px-4 py-2 text-gray-700 bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">All Projects</h1>
            <p className="text-gray-600 mt-2">Manage and view all projects in the system</p>
          </div>
          <button 
            onClick={() => navigate('/admin/create-project')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm"
          >
            <Plus size={20} />
            <span>New Project</span>
          </button>
        </div>

        <ProjectList />
      </div>
    </div>
  )
}

export default ViewProjects

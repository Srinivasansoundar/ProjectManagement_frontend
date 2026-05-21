import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import CreateProjectForm from '../components/CreateProjectForm'

const CreateProject: React.FC = () => {
  const navigate = useNavigate()
  
  const handleSuccess = () => {
    console.log('Project created successfully')
    navigate('/admin/projects')
  }

  const handleError = (error: string) => {
    console.error('Error creating project:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/admin')}
          className="mb-6 flex items-center gap-2 px-4 py-2 text-gray-700 bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600 mt-2">Create and manage your projects</p>
        </div>

        <CreateProjectForm onSuccess={handleSuccess} onError={handleError} />
      </div>
    </div>
  )
}

export default CreateProject

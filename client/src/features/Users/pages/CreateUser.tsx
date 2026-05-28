import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import CreateUserForm from '../components/CreateUserForm'

const CreateUser: React.FC = () => {
  const navigate = useNavigate()
  
  const handleSuccess = () => {
    console.log('User created successfully')
    navigate('/admin/users')
  }

  const handleError = (error: string) => {
    console.error('Error creating user:', error)
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
          <h1 className="text-4xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Create and manage system users</p>
        </div>

        <CreateUserForm onSuccess={handleSuccess} onError={handleError} />
      </div>
    </div>
  )
}

export default CreateUser

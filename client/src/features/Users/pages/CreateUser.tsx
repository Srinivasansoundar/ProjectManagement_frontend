import React from 'react'
import CreateUserForm from '../components/CreateUserForm'

const CreateUser: React.FC = () => {
  const handleSuccess = () => {
    console.log('User created successfully')
  }

  const handleError = (error: string) => {
    console.error('Error creating user:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
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

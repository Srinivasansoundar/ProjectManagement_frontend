import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { userService } from '../../Dashboard/services'
import type { ProjectResponse } from '../types'
import projectService from '../services/projectService'

interface AssignManagerModalProps {
  project: ProjectResponse
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface User {
  id: string
  name: string
  email: string
  role: string
}

const AssignManagerModal: React.FC<AssignManagerModalProps> = ({ project, isOpen, onClose, onSuccess }) => {
  const [managers, setManagers] = useState<User[]>([])
  const [selectedManagerId, setSelectedManagerId] = useState<string>(project.manager_id || '')
  const [loading, setLoading] = useState(false)
  const [fetchingUsers, setFetchingUsers] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchManagers()
      setSelectedManagerId(project.manager_id || '')
      setError(null)
    }
  }, [isOpen, project])

  const fetchManagers = async () => {
    setFetchingUsers(true)
    try {
      const allUsers = await userService.getAllUsers()
      const managerUsers = allUsers.filter(u => u.role === 'manager')
      setManagers(managerUsers)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch managers')
    } finally {
      setFetchingUsers(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedManagerId) {
      setError('Please select a manager')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await projectService.assignManager(project.id, selectedManagerId)
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to assign manager')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Assign Manager</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Manager for <span className="font-semibold">{project.name}</span></label>
              {fetchingUsers ? (
                <div className="p-4 text-center text-gray-500">Loading managers...</div>
              ) : (
                <select
                  value={selectedManagerId}
                  onChange={(e) => setSelectedManagerId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">-- Select a Manager --</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name} ({manager.email})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || fetchingUsers || !selectedManagerId || selectedManagerId === project.manager_id}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:bg-gray-400"
            >
              {loading ? 'Assigning...' : 'Assign Manager'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AssignManagerModal

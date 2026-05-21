import React, { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'
import projectService from '../services/projectService'
import userService from '../../Dashboard/services/userService'
import type { ProjectResponse } from '../types'

interface AssignDeveloperModalProps {
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

const AssignDeveloperModal: React.FC<AssignDeveloperModalProps> = ({ project, isOpen, onClose, onSuccess }) => {
  const [developers, setDevelopers] = useState<User[]>([])
  const [selectedDeveloperIds, setSelectedDeveloperIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchingUsers, setFetchingUsers] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchDevelopersAndExisting()
      setError(null)
    }
  }, [isOpen, project])

  const fetchDevelopersAndExisting = async () => {
    setFetchingUsers(true)
    try {
      const [allUsers, existingDevs] = await Promise.all([
        userService.getAllUsers(),
        projectService.getProjectDevelopers(project.id).catch(() => ({ developer_ids: [] })) // Fallback to empty array
      ])
      const developerUsers = allUsers.filter(u => u.role === 'developer')
      setDevelopers(developerUsers)

      // developer_ids is already an array of strings (UUIDs)
      const existingIds = existingDevs?.developer_ids || []
      setSelectedDeveloperIds(existingIds)

    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch developers')
    } finally {
      setFetchingUsers(false)
    }
  }

  const toggleDeveloper = (id: string) => {
    setSelectedDeveloperIds(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await projectService.assignDeveloper(project.id, { developer_ids: selectedDeveloperIds })
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to assign developers')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Assign Developers</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
          <div className="p-6 overflow-y-auto flex-grow">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Select developers for <span className="font-semibold">{project.name}</span></p>

              {fetchingUsers ? (
                <div className="p-4 text-center text-gray-500">Loading developers...</div>
              ) : developers.length === 0 ? (
                <div className="p-4 text-center text-gray-500 border border-gray-200 rounded-lg">No developers found in the system.</div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {developers.map((dev) => {
                    const isSelected = selectedDeveloperIds.includes(dev.id)
                    return (
                      <div
                        key={dev.id}
                        onClick={() => toggleDeveloper(dev.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                          }`}>
                          {isSelected && <Check size={14} className="text-white" />}
                        </div>
                        <div>
                          <p className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>{dev.name}</p>
                          <p className="text-xs text-gray-500">{dev.email}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || fetchingUsers}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:bg-gray-400"
            >
              {loading ? 'Saving...' : 'Save Developers'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AssignDeveloperModal

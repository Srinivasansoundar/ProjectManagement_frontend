import React, { useState, useEffect } from 'react'
import { Edit2, Trash2, UserPlus, Users, Loader2 } from 'lucide-react'
import projectService from "../services/projectService"
import type { ProjectResponse } from '../types'
import EditProjectModal from './EditProjectModal'
import AssignManagerModal from './AssignManagerModal'
import AssignDeveloperModal from './AssignDeveloperModal'

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modals state
  const [selectedProject, setSelectedProject] = useState<ProjectResponse | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false)
  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false)

  const fetchProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await projectService.getAllProjects()
      setProjects(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the project "${name}"?`)) {
      try {
        await projectService.deleteProject(id)
        fetchProjects()
      } catch (err: any) {
        alert(err.response?.data?.detail || err.message || 'Failed to delete project')
      }
    }
  }

  const openEditModal = (project: ProjectResponse) => {
    setSelectedProject(project)
    setIsEditModalOpen(true)
  }

  const openManagerModal = (project: ProjectResponse) => {
    setSelectedProject(project)
    setIsManagerModalOpen(true)
  }

  const openDeveloperModal = (project: ProjectResponse) => {
    setSelectedProject(project)
    setIsDeveloperModalOpen(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm border border-gray-100">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-6 rounded-lg border border-red-200">
        <h3 className="text-lg font-bold mb-2">Error</h3>
        <p>{error}</p>
        <button
          onClick={fetchProjects}
          className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded transition-colors text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded-lg shadow-sm border border-gray-100">
        <p className="text-gray-500 mb-4">No projects found in the system.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Description</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <span className="font-semibold text-gray-900">{project.name}</span>
                  {project.manager_id && (
                    <span className="block text-xs text-gray-500 mt-1">Has Manager</span>
                  )}
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
                      project.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'}`}
                  >
                    {project.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 text-gray-600 text-sm max-w-xs truncate" title={project.description}>
                  {project.description || '-'}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openManagerModal(project)}
                      title="Assign Manager"
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                    >
                      <UserPlus size={18} />
                    </button>
                    <button
                      onClick={() => openDeveloperModal(project)}
                      title="Assign Developers"
                      className="p-2 text-teal-600 hover:bg-teal-50 rounded transition-colors"
                    >
                      <Users size={18} />
                    </button>
                    <button
                      onClick={() => openEditModal(project)}
                      title="Edit Project"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id, project.name)}
                      title="Delete Project"
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedProject && (
        <>
          <EditProjectModal
            project={selectedProject}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={() => {
              setIsEditModalOpen(false)
              fetchProjects()
            }}
          />
          <AssignManagerModal
            project={selectedProject}
            isOpen={isManagerModalOpen}
            onClose={() => setIsManagerModalOpen(false)}
            onSuccess={() => {
              setIsManagerModalOpen(false)
              fetchProjects()
            }}
          />
          <AssignDeveloperModal
            project={selectedProject}
            isOpen={isDeveloperModalOpen}
            onClose={() => setIsDeveloperModalOpen(false)}
            onSuccess={() => {
              setIsDeveloperModalOpen(false)
              fetchProjects()
            }}
          />
        </>
      )}
    </div>
  )
}

export default ProjectList

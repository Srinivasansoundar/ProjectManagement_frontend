import { useState } from 'react'
import projectService from '../services/projectService'
import type { CreateProjectRequest } from '../types'
import { useAppSelector } from '../../../hooks/useAppSelector'

export const useCreateProject = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { user } = useAppSelector((state) => state.auth)

  const createProject = async (projectData: Omit<CreateProjectRequest, 'created_by'>, onSuccess?: () => void, onError?: (err: string) => void) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      if (!user?.id) {
        throw new Error('User not authenticated')
      }

      const fullData: CreateProjectRequest = {
        ...projectData,
        created_by: user.id
      }

      await projectService.createProject(fullData)
      setSuccess(true)
      onSuccess?.()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to create project'
      setError(errorMsg)
      onError?.(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return {
    createProject,
    loading,
    error,
    success
  }
}

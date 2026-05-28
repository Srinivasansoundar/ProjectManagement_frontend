import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from '../features/auth/pages'
import { AdminDashboard, ManagerDashboard, DeveloperDashboard } from '../features/Dashboard/pages'
import { CreateUser, GetAllUsers, EditUser } from '../features/Users/pages'
import { CreateProject, ViewProjects } from '../features/Projects/pages'
import { ProjectTasks, DeveloperTasks } from '../features/Task/pages'
import PrivateRoute from './PrivateRoute'
import { useAppSelector } from '../hooks/useAppSelector'

const AppRoutes: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)

  // Helper for base path redirection based on role for logged in user
  const getDefaultRoute = () => {
    if (!user) return '/login'
    if (user.role === 'admin') return '/admin'
    if (user.role === 'manager') return '/manager'
    if (user.role === 'developer') return '/developer'
    return '/login'
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes specific to roles */}
      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/create-user" element={<CreateUser />} />
        <Route path="/admin/users" element={<GetAllUsers />} />
        <Route path="/admin/users/:id/edit" element={<EditUser />} />
        <Route path="/admin/create-project" element={<CreateProject />} />
        <Route path="/admin/projects" element={<ViewProjects />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={['manager']} />}>
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/manager/projects/:projectId/tasks" element={<ProjectTasks />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={['developer']} />}>
        <Route path="/developer" element={<DeveloperDashboard />} />
        <Route path="/developer/tasks" element={<DeveloperTasks />} />
      </Route>

      {/* Fallback to default route */}
      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  )
}

export default AppRoutes

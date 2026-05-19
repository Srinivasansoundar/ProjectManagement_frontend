import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../hooks/useAppSelector'
import { type UserRole } from '../features/auth'

interface PrivateRouteProps {
    allowedRoles?: UserRole[]
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
    const { user } = useAppSelector((state) => state.auth)

    if (!user) {
        return <Navigate to="/login" replace />
    }

    // If specific roles are required and the user isn't in those roles
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Navigate to their specific role dashboard implicitly instead of a blank unauthorized page
        if (user.role === 'admin') return <Navigate to="/admin" replace />
        if (user.role === 'manager') return <Navigate to="/manager" replace />
        if (user.role === 'developer') return <Navigate to="/developer" replace />
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export default PrivateRoute

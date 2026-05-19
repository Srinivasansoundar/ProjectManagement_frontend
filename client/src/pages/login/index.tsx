import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../hooks/useAppSelector'
import { LoginForm } from '../../features/auth'
import AuthLayout from '../../layouts/AuthLayout'

const LoginPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'manager') navigate('/manager')
      else if (user.role === 'developer') navigate('/developer')
      else navigate('/') // fallback
    }
  }, [user, navigate])

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}

export default LoginPage

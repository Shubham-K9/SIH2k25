import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function OAuthCallback() {
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('access_token') || params.get('token')
    const abhaId = params.get('abha_id') || ''
    const userId = params.get('user_id') || ''
    if (token) {
      login(token, { user: { id: userId || 'abha-user' }, abhaId })
      navigate('/home', { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }, [login, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center text-gray-600">Completing ABHA login…</div>
    </div>
  )
}



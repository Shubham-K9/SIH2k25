import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('abha_token') || '')
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('abha_user') || 'null') } catch { return null }
  })
  const [abhaId, setAbhaId] = useState(() => localStorage.getItem('abha_id') || '')
  const [lastLogin, setLastLogin] = useState(() => localStorage.getItem('abha_last_login') || '')

  useEffect(() => {
    if (token) {
      localStorage.setItem('abha_token', token)
    } else {
      localStorage.removeItem('abha_token')
    }
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem('abha_user', JSON.stringify(user))
    else localStorage.removeItem('abha_user')
  }, [user])

  useEffect(() => {
    if (abhaId) localStorage.setItem('abha_id', abhaId)
    else localStorage.removeItem('abha_id')
  }, [abhaId])

  useEffect(() => {
    if (lastLogin) localStorage.setItem('abha_last_login', lastLogin)
    else localStorage.removeItem('abha_last_login')
  }, [lastLogin])

  const value = useMemo(() => ({
    token,
    user,
    abhaId,
    lastLogin,
    isAuthenticated: Boolean(token),
    login: (newToken, meta = {}) => {
      setToken(newToken)
      if (meta.user) setUser(meta.user)
      if (meta.abhaId) setAbhaId(meta.abhaId)
      setLastLogin(new Date().toISOString())
    },
    logout: () => {
      setToken('')
      setUser(null)
      setAbhaId('')
      setLastLogin('')
    }
  }), [token, user, abhaId, lastLogin])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}



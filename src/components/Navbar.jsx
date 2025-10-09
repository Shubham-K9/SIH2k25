import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Navbar() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur supports-backdrop-blur:bg-white/60">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-3 text-lg font-semibold">
            <button
              aria-label="Go back"
              title="Go back"
              className="group inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm text-gray-700 transition-all duration-200 hover:-translate-x-0.5 hover:bg-gray-50 active:translate-x-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
              onClick={() => navigate(-1)}
            >
              <svg className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L7.414 9H16a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span>Back</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏥</span>
              <span>EMR Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <button
                className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white">
                  {(user?.name || 'Dr.Shubham Kadbhane').slice(0,1)}
                </span>
                <span className="hidden md:inline font-medium">{user?.name || 'Dr.Shubham Kadbhane'}</span>
                <span className="ml-1 hidden rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 md:inline">
                  {user?.role || 'Doctor'}
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border bg-white shadow-lg">
                  <div className="px-3 py-2 text-sm text-gray-700">
                    <div className="font-semibold">{user?.name || 'Dr.Shubham Kadbhane'}</div>
                    <div className="text-xs text-gray-500">Role: {user?.role || 'Doctor'}</div>
                  </div>
                  <div className="border-t">
                    <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50" onClick={() => { setMenuOpen(false); navigate('/abha-settings') }}>ABHA Settings</button>
                    <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50" onClick={() => { setMenuOpen(false); navigate('/audit-logs') }}>Audit Logs</button>
                    <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50" onClick={() => { setMenuOpen(false); navigate('/abha-settings') }}>Change User</button>
                    <button className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50" onClick={() => { setMenuOpen(false); handleLogout() }}>Sign out</button>
                  </div>
                </div>
              )}
            </div>
            <button className="btn bg-white hover:bg-gray-50" onClick={() => navigate('/abha-settings')}>ABHA Settings</button>
            <button 
              className="btn bg-brand text-white hover:bg-brand-dark flex items-center gap-2" 
              onClick={() => navigate('/audit-logs')}
              title="View Audit Logs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Audit Logs
            </button>
            <button className="btn bg-gray-800 text-white hover:bg-gray-700" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </nav>
  )
}



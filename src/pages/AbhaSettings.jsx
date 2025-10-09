import React from 'react'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../auth/AuthContext.jsx'

export default function AbhaSettings() {
  const { token, user, abhaId, lastLogin } = useAuth()

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-4 text-3xl font-bold">ABHA Settings</h1>
        <p className="mb-6 text-gray-600">Manage your ABHA linkage, view session status, and account details.</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card">
            <div className="mb-2 text-sm font-medium text-gray-700">ABHA Account</div>
            <div className="text-gray-900"><span className="font-semibold">ABHA ID:</span> {abhaId || 'Not linked'}</div>
            <div className="text-gray-900"><span className="font-semibold">User ID:</span> {user?.id || '-'}</div>
          </div>
          <div className="card">
            <div className="mb-2 text-sm font-medium text-gray-700">Session</div>
            <div className="text-gray-900"><span className="font-semibold">Token:</span> {token ? 'Present' : 'Missing'}</div>
            <div className="text-gray-900"><span className="font-semibold">Last Login:</span> {lastLogin || '-'}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <a href="/oauth/abha/authorize" className="btn btn-primary">Link / Re-link ABHA</a>
          <button className="btn bg-white hover:bg-gray-50">View Consent & Permissions</button>
        </div>
      </main>
    </div>
  )
}



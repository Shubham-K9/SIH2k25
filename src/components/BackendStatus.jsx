import React, { useState, useEffect } from 'react'
import api from '../services/apiClient.js'

export default function BackendStatus() {
  const [status, setStatus] = useState('checking')
  const [error, setError] = useState(null)
  const [lastChecked, setLastChecked] = useState(null)
  const [isFallbackMode, setIsFallbackMode] = useState(false)

  useEffect(() => {
    checkBackendStatus()
  }, [])

  async function checkBackendStatus() {
    try {
      setStatus('checking')
      setError(null)
      setIsFallbackMode(false)
      
      const response = await api.get('/health')
      setStatus('connected')
      setLastChecked(new Date().toLocaleString())
    } catch (err) {
      setStatus('disconnected')
      setError(err.message)
      setLastChecked(new Date().toLocaleString())
      setIsFallbackMode(true)
    }
  }

  function getStatusColor() {
    if (isFallbackMode) {
      return 'text-orange-600 bg-orange-100'
    }
    
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-100'
      case 'disconnected':
        return 'text-red-600 bg-red-100'
      case 'checking':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  function getStatusIcon() {
    if (isFallbackMode) {
      return '🔄'
    }
    
    switch (status) {
      case 'connected':
        return '✅'
      case 'disconnected':
        return '❌'
      case 'checking':
        return '⏳'
      default:
        return '❓'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className={`rounded-lg border p-3 shadow-lg ${getStatusColor()}`}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {getStatusIcon()} {isFallbackMode ? 'Fallback Mode' : 'Backend'}
          </span>
          <button
            onClick={checkBackendStatus}
            className="text-xs underline hover:no-underline"
            disabled={status === 'checking'}
          >
            {status === 'checking' ? 'Checking...' : 'Refresh'}
          </button>
        </div>
        
        {lastChecked && (
          <div className="text-xs mt-1 opacity-75">
            Last checked: {lastChecked}
          </div>
        )}
        
        {error && (
          <div className="text-xs mt-1 opacity-75">
            Error: {error}
          </div>
        )}
        
        {isFallbackMode && (
          <div className="text-xs mt-1 opacity-75">
            Using mock data - backend unavailable
          </div>
        )}
      </div>
    </div>
  )
}

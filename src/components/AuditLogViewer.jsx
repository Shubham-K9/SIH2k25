import React, { useState, useEffect } from 'react'
import { usePatients } from '../context/PatientContext.jsx'

export default function AuditLogViewer({ patientId = null, showFilters = true }) {
  const { getPatientAuditLogs, getPatientAuditSummary } = usePatients()
  const [auditLogs, setAuditLogs] = useState([])
  const [auditSummary, setAuditSummary] = useState(null)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    eventType: '',
    action: '',
    outcome: ''
  })
  const [loading, setLoading] = useState(false)
  const [selectedLog, setSelectedLog] = useState(null)

  useEffect(() => {
    loadAuditData()
  }, [patientId, filters])

  function loadAuditData() {
    setLoading(true)
    try {
      const logs = getPatientAuditLogs(patientId)
      setAuditLogs(logs)
      
      if (patientId) {
        const summary = getPatientAuditSummary(patientId)
        setAuditSummary(summary)
      }
    } catch (error) {
      console.error('Error loading audit data:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleFilterChange(e) {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  function clearFilters() {
    setFilters({
      startDate: '',
      endDate: '',
      eventType: '',
      action: '',
      outcome: ''
    })
  }

  function formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Kolkata'
    })
  }

  function getActionBadge(action) {
    const actionMap = {
      'C': { text: 'Create', color: 'bg-green-100 text-green-800' },
      'R': { text: 'Read', color: 'bg-blue-100 text-blue-800' },
      'U': { text: 'Update', color: 'bg-yellow-100 text-yellow-800' },
      'D': { text: 'Delete', color: 'bg-red-100 text-red-800' },
      'E': { text: 'Execute', color: 'bg-purple-100 text-purple-800' }
    }
    
    const actionInfo = actionMap[action] || { text: action, color: 'bg-gray-100 text-gray-800' }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${actionInfo.color}`}>
        {actionInfo.text}
      </span>
    )
  }

  function getOutcomeBadge(outcome) {
    const outcomeMap = {
      '0': { text: 'Success', color: 'bg-green-100 text-green-800' },
      '4': { text: 'Minor Failure', color: 'bg-yellow-100 text-yellow-800' },
      '8': { text: 'Serious Failure', color: 'bg-red-100 text-red-800' },
      '12': { text: 'Major Failure', color: 'bg-red-100 text-red-800' }
    }
    
    const outcomeInfo = outcomeMap[outcome] || { text: 'Unknown', color: 'bg-gray-100 text-gray-800' }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${outcomeInfo.color}`}>
        {outcomeInfo.text}
      </span>
    )
  }

  function getEventTypeBadge(eventType) {
    const eventMap = {
      'rest': { text: 'REST API', color: 'bg-blue-100 text-blue-800' },
      'consent': { text: 'Consent', color: 'bg-purple-100 text-purple-800' },
      'auth': { text: 'Authentication', color: 'bg-orange-100 text-orange-800' },
      'system': { text: 'System', color: 'bg-gray-100 text-gray-800' }
    }
    
    const eventInfo = eventMap[eventType] || { text: eventType, color: 'bg-gray-100 text-gray-800' }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${eventInfo.color}`}>
        {eventInfo.text}
      </span>
    )
  }

  function filteredLogs() {
    let filtered = auditLogs

    if (filters.startDate) {
      filtered = filtered.filter(log => new Date(log.recorded) >= new Date(filters.startDate))
    }

    if (filters.endDate) {
      filtered = filtered.filter(log => new Date(log.recorded) <= new Date(filters.endDate))
    }

    if (filters.eventType) {
      filtered = filtered.filter(log => log.type.code === filters.eventType)
    }

    if (filters.action) {
      filtered = filtered.filter(log => log.action === filters.action)
    }

    if (filters.outcome) {
      filtered = filtered.filter(log => log.outcome === filters.outcome)
    }

    return filtered
  }

  function exportLogs(format = 'json') {
    const logs = filteredLogs()
    let data, mimeType, filename

    switch (format) {
      case 'csv':
        data = convertToCSV(logs)
        mimeType = 'text/csv'
        filename = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`
        break
      case 'json':
      default:
        data = JSON.stringify(logs, null, 2)
        mimeType = 'application/json'
        filename = `audit_logs_${new Date().toISOString().split('T')[0]}.json`
        break
    }

    const blob = new Blob([data], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function convertToCSV(logs) {
    const headers = ['Timestamp', 'Event Type', 'Action', 'Outcome', 'Description', 'User', 'Patient ID']
    const rows = logs.map(log => [
      log.recorded,
      log.type.display,
      log.action,
      log.outcome,
      log.outcomeDesc || '',
      log.agent[0]?.who?.display || 'Unknown',
      log.entity[0]?.what?.reference?.split('/')[1] || 'N/A'
    ])
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  const logs = filteredLogs()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {patientId ? 'Patient Audit Log' : 'System Audit Log'}
          </h3>
          {auditSummary && (
            <p className="text-sm text-gray-600">
              {auditSummary.totalEvents} events • Last updated: {auditSummary.lastUpdated ? formatTimestamp(auditSummary.lastUpdated) : 'Never'}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => exportLogs('json')}
            className="btn btn-primary text-sm"
          >
            Export JSON
          </button>
          <button
            onClick={() => exportLogs('csv')}
            className="btn btn-primary text-sm"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="label">Start Date</label>
              <input
                type="datetime-local"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="input"
              />
            </div>
            <div>
              <label className="label">End Date</label>
              <input
                type="datetime-local"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="input"
              />
            </div>
            <div>
              <label className="label">Event Type</label>
              <select
                name="eventType"
                value={filters.eventType}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">All Types</option>
                <option value="rest">REST API</option>
                <option value="consent">Consent</option>
                <option value="auth">Authentication</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <label className="label">Action</label>
              <select
                name="action"
                value={filters.action}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">All Actions</option>
                <option value="C">Create</option>
                <option value="R">Read</option>
                <option value="U">Update</option>
                <option value="D">Delete</option>
                <option value="E">Execute</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="btn btn-primary w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs Table */}
      <div className="card">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading audit logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No audit logs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Outcome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log, index) => (
                  <tr key={log.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTimestamp(log.recorded)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getEventTypeBadge(log.type.code)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getActionBadge(log.action)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getOutcomeBadge(log.outcome)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {log.outcomeDesc || 'No description'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.agent[0]?.who?.display || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-brand hover:text-brand-dark"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Audit Log Details</h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Event ID</label>
                    <p className="text-sm text-gray-900">{selectedLog.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Timestamp</label>
                    <p className="text-sm text-gray-900">{formatTimestamp(selectedLog.recorded)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Event Type</label>
                    <p className="text-sm text-gray-900">{selectedLog.type.display}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Action</label>
                    <p className="text-sm text-gray-900">{selectedLog.action}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Outcome</label>
                    <p className="text-sm text-gray-900">{selectedLog.outcome}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-sm text-gray-900">{selectedLog.outcomeDesc || 'No description'}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">User</label>
                  <p className="text-sm text-gray-900">{selectedLog.agent[0]?.who?.display || 'Unknown'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Raw Data</label>
                  <pre className="text-xs text-gray-900 bg-gray-100 p-3 rounded overflow-x-auto">
                    {JSON.stringify(selectedLog, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

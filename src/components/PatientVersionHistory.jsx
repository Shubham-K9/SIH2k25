import React, { useState } from 'react'
import { usePatients } from '../context/PatientContext.jsx'

export default function PatientVersionHistory({ patientId }) {
  const { getPatientVersions, getPatientVersion, getPatient } = usePatients()
  const [versions, setVersions] = useState([])
  const [selectedVersion, setSelectedVersion] = useState(null)
  const [loading, setLoading] = useState(false)

  React.useEffect(() => {
    if (patientId) {
      loadVersions()
    }
  }, [patientId])

  function loadVersions() {
    setLoading(true)
    try {
      const versionHistory = getPatientVersions(patientId)
      setVersions(versionHistory)
    } catch (error) {
      console.error('Error loading version history:', error)
    } finally {
      setLoading(false)
    }
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

  function getVersionBadge(versionId) {
    const isLatest = versionId === versions[versions.length - 1]?.meta?.versionId
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isLatest ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {isLatest ? 'Current' : `v${versionId}`}
      </span>
    )
  }

  function compareVersions(version1, version2) {
    if (!version1 || !version2) return []
    
    const changes = []
    
    // Compare basic fields
    const fields = ['name', 'gender', 'birthDate', 'telecom', 'address']
    
    fields.forEach(field => {
      const val1 = version1[field]
      const val2 = version2[field]
      
      if (JSON.stringify(val1) !== JSON.stringify(val2)) {
        changes.push({
          field,
          oldValue: val1,
          newValue: val2,
          type: 'modified'
        })
      }
    })
    
    return changes
  }

  function getChangesForVersion(version) {
    const versionIndex = versions.findIndex(v => v.meta.versionId === version.meta.versionId)
    if (versionIndex === 0) return [{ field: 'created', type: 'created' }]
    
    const previousVersion = versions[versionIndex - 1]
    return compareVersions(previousVersion, version)
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading version history...</p>
      </div>
    )
  }

  if (versions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No version history available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Version History</h3>
          <p className="text-sm text-gray-600">
            {versions.length} version{versions.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <button
          onClick={loadVersions}
          className="btn btn-primary text-sm"
        >
          Refresh
        </button>
      </div>

      {/* Version Timeline */}
      <div className="space-y-4">
        {versions.map((version, index) => {
          const changes = getChangesForVersion(version)
          const isLatest = index === versions.length - 1
          
          return (
            <div key={version.meta.versionId} className="relative">
              {/* Timeline line */}
              {index < versions.length - 1 && (
                <div className="absolute left-4 top-8 w-0.5 h-16 bg-gray-300"></div>
              )}
              
              <div className="relative flex items-start space-x-4">
                {/* Version indicator */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  isLatest ? 'bg-green-500' : 'bg-gray-400'
                }`}>
                  <span className="text-white text-sm font-medium">
                    {version.meta.versionId}
                  </span>
                </div>
                
                {/* Version content */}
                <div className="flex-1 min-w-0">
                  <div className="card hover:shadow-md transition-shadow cursor-pointer"
                       onClick={() => setSelectedVersion(version)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getVersionBadge(version.meta.versionId)}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            Version {version.meta.versionId}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {formatTimestamp(version.meta.lastUpdated)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {changes.length} change{changes.length !== 1 ? 's' : ''}
                        </p>
                        <button className="text-brand hover:text-brand-dark text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                    
                    {/* Changes preview */}
                    {changes.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="space-y-1">
                          {changes.slice(0, 3).map((change, changeIndex) => (
                            <div key={changeIndex} className="text-sm text-gray-600">
                              <span className="font-medium">{change.field}:</span>
                              {change.type === 'created' ? (
                                <span className="text-green-600"> Created</span>
                              ) : (
                                <span className="text-yellow-600"> Modified</span>
                              )}
                            </div>
                          ))}
                          {changes.length > 3 && (
                            <div className="text-sm text-gray-500">
                              +{changes.length - 3} more changes
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Version Details Modal */}
      {selectedVersion && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Version {selectedVersion.meta.versionId} Details
                </h3>
                <button
                  onClick={() => setSelectedVersion(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Version Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Version ID</label>
                    <p className="text-sm text-gray-900">{selectedVersion.meta.versionId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-sm text-gray-900">{formatTimestamp(selectedVersion.meta.lastUpdated)}</p>
                  </div>
                </div>
                
                {/* Patient Data */}
                <div>
                  <label className="text-sm font-medium text-gray-500">Patient Data</label>
                  <div className="mt-2 space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Name:</span>
                        <span className="ml-2 text-sm text-gray-900">
                          {selectedVersion.name?.[0]?.given?.join(' ')} {selectedVersion.name?.[0]?.family}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Gender:</span>
                        <span className="ml-2 text-sm text-gray-900">{selectedVersion.gender}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Birth Date:</span>
                        <span className="ml-2 text-sm text-gray-900">{selectedVersion.birthDate}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Contact:</span>
                        <span className="ml-2 text-sm text-gray-900">
                          {selectedVersion.telecom?.[0]?.value}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Changes */}
                <div>
                  <label className="text-sm font-medium text-gray-500">Changes in this Version</label>
                  <div className="mt-2 space-y-2">
                    {getChangesForVersion(selectedVersion).map((change, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          change.type === 'created' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {change.type === 'created' ? 'Created' : 'Modified'}
                        </span>
                        <span className="text-sm text-gray-900">{change.field}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Raw Data */}
                <div>
                  <label className="text-sm font-medium text-gray-500">Raw FHIR Data</label>
                  <pre className="text-xs text-gray-900 bg-gray-100 p-3 rounded overflow-x-auto max-h-64">
                    {JSON.stringify(selectedVersion, null, 2)}
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

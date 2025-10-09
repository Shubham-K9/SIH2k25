import React, { useMemo, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { usePatients } from '../context/PatientContext.jsx'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import PatientVersionHistory from '../components/PatientVersionHistory.jsx'
import AuditLogViewer from '../components/AuditLogViewer.jsx'

export default function PatientRecords() {
  const { patients, accessPatient, getPatientAuditSummary, getConsentSummary } = usePatients()
  const [query, setQuery] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [activeTab, setActiveTab] = useState('records')
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [showAuditLogs, setShowAuditLogs] = useState(false)
  
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return patients
    return patients.filter((p) => p.name.toLowerCase().includes(q))
  }, [patients, query])

  function generatePdf() {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
    doc.setFontSize(14)
    doc.text('Patient Records - FHIR R4 Compliant', 40, 40)
    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`, 40, 60)
    
    const rows = filtered.map((p) => [
      p.name, 
      String(p.age), 
      p.gender, 
      p.contact,
      p.version || '1',
      new Date(p.lastUpdated || p.createdAt).toLocaleDateString('en-IN')
    ])
    
    // @ts-ignore - plugin extends doc
    doc.autoTable({
      head: [['Name', 'Age', 'Gender', 'Contact', 'Version', 'Last Updated']],
      body: rows,
      startY: 80,
      styles: { fontSize: 10 }
    })
    doc.save('patient-records-fhir-compliant.pdf')
  }

  function handlePatientClick(patient) {
    setSelectedPatient(patient)
    accessPatient(patient.id) // Log the access
  }

  function formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    })
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Patient Records</h2>
              <p className="mt-2 text-gray-600">
                FHIR R4 compliant patient management with version tracking and audit logs
              </p>
            </div>
            <button onClick={generatePdf} className="btn btn-primary">
              ⬇️ Generate PDF
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('records')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'records'
                  ? 'border-brand text-brand'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Patient Records
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'audit'
                  ? 'border-brand text-brand'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Audit Logs
            </button>
          </nav>
        </div>

        {/* Patient Records Tab */}
        {activeTab === 'records' && (
          <div className="space-y-6">
            <div className="card">
              <div className="mb-4 flex items-center justify-between gap-4">
                <input 
                  className="input" 
                  placeholder="Search by name…" 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                />
                <span className="text-sm text-gray-500">{filtered.length} result(s)</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filtered.map((p) => {
                      const auditSummary = getPatientAuditSummary(p.id)
                      const consentSummary = getConsentSummary(p.id)
                      
                      return (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{p.name}</div>
                                <div className="text-sm text-gray-500">ID: {p.id.slice(0, 8)}...</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.age}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.gender}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.contact}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              v{p.version || '1'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatTimestamp(p.lastUpdated || p.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handlePatientClick(p)}
                              className="text-brand hover:text-brand-dark"
                            >
                              View
                            </button>
                            <button
                              onClick={() => {
                                setSelectedPatient(p)
                                setShowVersionHistory(true)
                              }}
                              className="text-purple-600 hover:text-purple-900"
                            >
                              History
                            </button>
                            <button
                              onClick={() => {
                                setSelectedPatient(p)
                                setShowAuditLogs(true)
                              }}
                              className="text-orange-600 hover:text-orange-900"
                            >
                              Audit
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                    {filtered.length === 0 && (
                      <tr>
                        <td className="px-6 py-10 text-center text-gray-500" colSpan={7}>
                          No patients found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'audit' && (
          <AuditLogViewer showFilters={true} />
        )}

        {/* Patient Details Modal */}
        {selectedPatient && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Patient Details</h3>
                  <button
                    onClick={() => setSelectedPatient(null)}
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
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-sm text-gray-900">{selectedPatient.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Age</label>
                      <p className="text-sm text-gray-900">{selectedPatient.age}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Gender</label>
                      <p className="text-sm text-gray-900">{selectedPatient.gender}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact</label>
                      <p className="text-sm text-gray-900">{selectedPatient.contact}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Version</label>
                      <p className="text-sm text-gray-900">{selectedPatient.version || '1'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <p className="text-sm text-gray-900">
                        {formatTimestamp(selectedPatient.lastUpdated || selectedPatient.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setSelectedPatient(null)
                          setShowVersionHistory(true)
                        }}
                        className="btn btn-primary"
                      >
                        View Version History
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPatient(null)
                          setShowAuditLogs(true)
                        }}
                        className="btn bg-orange-500 text-white hover:bg-orange-600"
                      >
                        View Audit Logs
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Version History Modal */}
        {showVersionHistory && selectedPatient && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Version History - {selectedPatient.name}
                  </h3>
                  <button
                    onClick={() => {
                      setShowVersionHistory(false)
                      setSelectedPatient(null)
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <PatientVersionHistory patientId={selectedPatient.id} />
              </div>
            </div>
          </div>
        )}

        {/* Audit Logs Modal */}
        {showAuditLogs && selectedPatient && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Audit Logs - {selectedPatient.name}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAuditLogs(false)
                      setSelectedPatient(null)
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <AuditLogViewer patientId={selectedPatient.id} showFilters={true} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}



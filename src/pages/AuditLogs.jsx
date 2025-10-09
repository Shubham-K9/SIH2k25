import React, { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import AuditLogViewer from '../components/AuditLogViewer.jsx'
import { usePatients } from '../context/PatientContext.jsx'

export default function AuditLogs() {
  const { patients, getPatientAuditLogs, getPatientAuditSummary } = usePatients()
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showAllLogs, setShowAllLogs] = useState(true)

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs & Compliance</h1>
          <p className="mt-2 text-gray-600">
            Comprehensive audit trail for all patient data operations, compliant with India's 2016 EHR Standards
          </p>
        </div>

        {/* Patient Selection */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Filter by Patient</h3>
              <p className="text-sm text-gray-600">Select a specific patient to view their audit logs</p>
            </div>
            <div className="flex space-x-4">
              <select
                value={selectedPatient || ''}
                onChange={(e) => setSelectedPatient(e.target.value || null)}
                className="input w-64"
              >
                <option value="">All Patients</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} (ID: {patient.id.slice(0, 8)}...)
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowAllLogs(!showAllLogs)}
                className={`btn ${showAllLogs ? 'bg-gray-300 text-gray-700' : 'btn-primary'}`}
              >
                {showAllLogs ? 'Show Patient Logs Only' : 'Show All Logs'}
              </button>
            </div>
          </div>
        </div>

        {/* Audit Log Viewer */}
        <AuditLogViewer 
          patientId={selectedPatient} 
          showFilters={true}
        />

        {/* Compliance Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-900">FHIR R4 Compliant</h4>
                <p className="text-sm text-gray-600">All data models follow FHIR R4 standards</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-900">ISO 22600 Compliant</h4>
                <p className="text-sm text-gray-600">Consent management follows ISO 22600</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-900">SNOMED-CT/LOINC</h4>
                <p className="text-sm text-gray-600">Semantic coding with standard terminologies</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

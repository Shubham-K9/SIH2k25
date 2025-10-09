import React, { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import api from '../services/apiClient.js'
import { useAuth } from '../auth/AuthContext.jsx'

export default function UploadEncounter() {
  const { abhaId, user, lastLogin, token } = useAuth()
  const [patientRef, setPatientRef] = useState(abhaId || '')
  const [dateTime, setDateTime] = useState('')
  const [problemList, setProblemList] = useState([{ system: 'NAMASTE', code: '', label: '' }])
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  function addProblem() {
    setProblemList((p) => [...p, { system: 'ICD11-TM2', code: '', label: '' }])
  }
  function removeProblem(idx) {
    setProblemList((p) => p.filter((_, i) => i !== idx))
  }
  function updateProblem(idx, field, value) {
    setProblemList((p) => p.map((row, i) => (i === idx ? { ...row, [field]: value } : row)))
  }

  function buildBundle() {
    const bundle = {
      resourceType: 'Bundle',
      type: 'transaction',
      entry: [
        {
          resource: {
            resourceType: 'Encounter',
            status: 'finished',
            subject: { reference: `Patient/${patientRef}` },
            period: dateTime ? { start: dateTime } : undefined
          }
        },
        ...problemList.filter(p => p.code).map((p) => ({
          resource: {
            resourceType: 'Condition',
            code: {
              coding: [{ system: p.system, code: p.code, display: p.label }]
            }
          }
        }))
      ]
    }
    return bundle
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')
    try {
      const bundle = buildBundle()
      await api.post('/uploadEncounter', bundle)
      setMessage('Encounter uploaded successfully!')
    } catch (e) {
      setMessage('Failed to upload encounter')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h2 className="mb-4 text-2xl font-semibold">Upload Encounter</h2>
        <div className="card space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Patient Reference (ABHA ID)</label>
                <input className="input" value={patientRef} onChange={(e) => setPatientRef(e.target.value)} placeholder="e.g., 22-1111-2222-3333" />
              </div>
              <div>
                <label className="label">Encounter Date/Time</label>
                <input type="datetime-local" className="input" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Problem List</span>
                <button type="button" className="btn bg-white hover:bg-gray-50" onClick={addProblem}>Add Problem</button>
              </div>
              <div className="space-y-3">
                {problemList.map((p, idx) => (
                  <div key={idx} className="grid gap-2 sm:grid-cols-12">
                    <select className="input sm:col-span-3" value={p.system} onChange={(e) => updateProblem(idx, 'system', e.target.value)}>
                      <option value="NAMASTE">NAMASTE</option>
                      <option value="ICD11-TM2">ICD-11 TM2</option>
                      <option value="ICD11-BIOMED">ICD-11 Biomed</option>
                    </select>
                    <input className="input sm:col-span-3" placeholder="Code" value={p.code} onChange={(e) => updateProblem(idx, 'code', e.target.value)} />
                    <input className="input sm:col-span-5" placeholder="Label" value={p.label} onChange={(e) => updateProblem(idx, 'label', e.target.value)} />
                    <button type="button" className="btn bg-red-50 text-red-700 hover:bg-red-100 sm:col-span-1" onClick={() => removeProblem(idx)}>Remove</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Uploading…' : 'Submit Bundle'}</button>
            </div>
          </form>
          {message && <div className="text-sm text-gray-700">{message}</div>}
        </div>

        <div className="mt-6 grid gap-2 rounded border bg-white p-4 text-sm text-gray-700">
          <div className="font-semibold">Session</div>
          <div>Token: {token ? 'Present' : 'Missing'}</div>
          <div>User ID: {user?.id || '-'}</div>
          <div>ABHA ID: {abhaId || '-'}</div>
          <div>Last Login: {lastLogin || '-'}</div>
        </div>
      </main>
    </div>
  )
}



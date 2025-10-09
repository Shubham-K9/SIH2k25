import React, { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { usePatients } from '../context/PatientContext.jsx'
import Toast from '../components/Toast.jsx'
import PatientForm from '../components/PatientForm.jsx'

export default function AddPatient() {
  const { addPatient } = usePatients()
  const [toast, setToast] = useState({ message: '', type: 'info' })

  function handleSubmit(data) {
    addPatient(data)
    setToast({ message: 'Patient added successfully', type: 'success' })
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h2 className="mb-4 text-2xl font-semibold">Add Patient</h2>
        <div className="card">
          <PatientForm onSubmit={handleSubmit} />
        </div>
      </main>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </div>
  )
}



import React from 'react'
import Navbar from '../components/Navbar.jsx'

const MOCK_PRESCRIPTIONS = [
  { id: '1', patient: 'Aman Gupta', doctor: 'Dr. Rao', medicines: ['Paracetamol 500mg', 'Cough Syrup'] },
  { id: '2', patient: 'Sneha Iyer', doctor: 'Dr. Mehta', medicines: ['Amoxicillin 250mg', 'Vitamin D3'] },
  { id: '3', patient: 'Rahul Sharma', doctor: 'Dr. Khan', medicines: ['Ibuprofen 400mg'] },
]

export default function Prescriptions() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h2 className="mb-4 text-2xl font-semibold">Prescriptions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_PRESCRIPTIONS.map((p) => (
            <div key={p.id} className="card">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold">{p.patient}</h3>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">{p.doctor}</span>
              </div>
              <ul className="list-inside list-disc text-gray-700">
                {p.medicines.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}



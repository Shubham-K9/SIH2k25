import React from 'react'
import { PatientProvider } from '../context/PatientContext.jsx'

export default function Providers({ children }) {
  return <PatientProvider>{children}</PatientProvider>
}



import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import AddPatient from './pages/AddPatient.jsx'
import PatientRecords from './pages/PatientRecords.jsx'
import Prescriptions from './pages/Prescriptions.jsx'
import AuditLogs from './pages/AuditLogs.jsx'
import { AuthProvider, useAuth } from './auth/AuthContext.jsx'
import Providers from './pages/_providers.jsx'
import OAuthCallback from './pages/OAuthCallback.jsx'
import Diagnosis from './pages/Diagnosis.jsx'
import UploadEncounter from './pages/UploadEncounter.jsx'
import AbhaSettings from './pages/AbhaSettings.jsx'
import Chatbot from './components/Chatbot.jsx'
import Footer from './components/Footer.jsx'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Providers>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-patient"
            element={
              <ProtectedRoute>
                <AddPatient />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-records"
            element={
              <ProtectedRoute>
                <PatientRecords />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prescriptions"
            element={
              <ProtectedRoute>
                <Prescriptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/diagnosis"
            element={
              <ProtectedRoute>
                <Diagnosis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload-encounter"
            element={
              <ProtectedRoute>
                <UploadEncounter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/abha-settings"
            element={
              <ProtectedRoute>
                <AbhaSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audit-logs"
            element={
              <ProtectedRoute>
                <AuditLogs />
              </ProtectedRoute>
            }
          />
          <Route path="/oauth/abha/callback" element={<OAuthCallback />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Chatbot />
        <Footer />
      </Providers>
    </AuthProvider>
  )
}



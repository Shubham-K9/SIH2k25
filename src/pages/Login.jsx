import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { initiateAbhaLogin, requestOtp, verifyOtp } from '../services/abhaAuth.js'
import Toast from '../components/Toast.jsx'

export default function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'info' })
  const [abhaAddress, setAbhaAddress] = useState('')
  const [mobile, setMobile] = useState('')
  const [txnId, setTxnId] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('input') // input | otp

  async function handleLogin() {
    setLoading(true)
    try {
      const { token } = await initiateAbhaLogin()
      login(token)
      setToast({ message: 'Login successful!', type: 'success' })
      navigate('/home', { replace: true })
    } catch (err) {
      setToast({ message: err.message || 'Login failed', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  async function handleRequestOtp(e) {
    e?.preventDefault?.()
    setLoading(true)
    try {
      const res = await requestOtp({ abhaAddress: abhaAddress.trim() || undefined, mobile: mobile.trim() || undefined })
      setTxnId(res.txnId)
      setStep('otp')
      setToast({ message: `OTP sent to ${res.masked}.`, type: 'success' })
      // Optional: surface demo OTP for quick testing
      // setToast({ message: `Demo OTP: ${res.demoOtp}`, type: 'info' })
    } catch (err) {
      setToast({ message: err.message || 'Failed to send OTP', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp(e) {
    e?.preventDefault?.()
    if (!txnId) return
    setLoading(true)
    try {
      const { token } = await verifyOtp({ txnId, otp: otp.trim() })
      login(token)
      setToast({ message: 'Login successful!', type: 'success' })
      navigate('/home', { replace: true })
    } catch (err) {
      setToast({ message: err.message || 'OTP verification failed', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (isAuthenticated) {
    navigate('/home', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-stretch justify-center login-animated-bg">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 md:grid-cols-2 gap-6 px-4 py-10">
        {/* Left: Branding & Hero */}
        <div className="relative hidden md:flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/MOA.png"
                alt="Ministry of AYUSH"
                className="h-14 w-14 object-contain opacity-90"
                onError={(e) => { 
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling.style.display = 'block'
                }}
              />
              <div style={{display: 'none'}}>
                <svg viewBox="0 0 64 64" className="h-12 w-12 text-gray-800" aria-hidden="true">
                  <circle cx="32" cy="32" r="30" fill="#1f2937" opacity="0.05" />
                  <path d="M32 10c6 6 10 10 10 16s-4 10-10 10-10-4-10-10 4-10 10-16z" fill="#10b981"/>
                  <path d="M22 44c4-2 8-3 10-3s6 1 10 3c2 1 3 3 3 5H19c0-2 1-4 3-5z" fill="#4f46e5"/>
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-600">Government of India</div>
                <div className="text-base font-semibold text-gray-900">Ministry of AYUSH</div>
              </div>
            </div>
            <div className="mt-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">ABDM • ABHA 2.0 • FHIR R4</div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight">EMR Portal</h1>
              <p className="mt-2 text-gray-600">Unified access for AYUSH providers. Secure OAuth and OTP login with ABHA.</p>
            </div>

            {/* Middle hero image between EMR Portal and ABHA Digital Health */}
            <div className="mt-6">
              <img
                src="/LoginPic.jpg"
                alt="Login Illustration"
                className="h-56 w-full rounded-xl border object-cover object-top opacity-95"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between rounded-xl border bg-white p-4">
            <div className="max-w-[70%]">
              <div className="text-sm font-semibold text-gray-900">ABHA Digital Health</div>
              <div className="text-sm text-gray-600">Link and manage your health records seamlessly using your ABHA ID.</div>
            </div>
            <img
              src="/ABHA.png"
              alt="ABHA / ABDM"
              className="h-32 w-32 object-contain opacity-95"
              onError={(e) => { 
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextElementSibling.style.display = 'block'
              }}
            />
            <div style={{display: 'none'}}>
              <svg viewBox="0 0 64 64" className="h-10 w-10" aria-hidden="true">
                <rect x="6" y="12" width="52" height="40" rx="8" fill="#10b981" opacity="0.15" />
                <path d="M16 36h12M16 28h20M36 28h12" stroke="#10b981" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="20" cy="20" r="3" fill="#4f46e5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right: Auth Card */}
        <div className="flex items-center">
          <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100 text-2xl">🏥</div>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight">Welcome back</h2>
              <p className="mt-1 text-sm text-gray-600">Sign in with your ABHA credentials</p>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">ABHA OTP Login</span>
                <button className="text-xs text-indigo-600 hover:underline" onClick={handleLogin} disabled={loading}>Skip (demo)</button>
              </div>

              <a
                href={`/oauth/abha/authorize`}
                className="btn w-full bg-gradient-to-r from-indigo-600 to-emerald-600 text-white hover:opacity-90"
              >
                Continue with ABHA OAuth
              </a>

              {step === 'input' && (
                <form onSubmit={handleRequestOtp} className="space-y-3">
                  <div>
                    <label className="label">ABHA ID</label>
                    <input value={abhaAddress} onChange={(e) => setAbhaAddress(e.target.value)} className="input" placeholder="Enter your 16 digit ABHA ID" maxLength={16} />
                  </div>
                  <div className="relative">
                    <label className="label">Mobile Number</label>
                    <input value={mobile} onChange={(e) => setMobile(e.target.value)} className="input" placeholder="e.g. 98XXXXXX90" />
                    <p className="mt-1 text-xs text-gray-500">Provide either 16-digit ABHA ID or mobile.</p>
                  </div>
                  <button className="btn btn-primary w-full text-lg" disabled={loading}>{loading ? 'Sending OTP…' : 'Send OTP'}</button>
                </form>
              )}

              {step === 'otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-3">
                  <div>
                    <label className="label">Enter OTP</label>
                    <input value={otp} onChange={(e) => setOtp(e.target.value)} className="input tracking-widest text-center" placeholder="6-digit OTP" maxLength={6} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <button type="button" className="text-gray-600 hover:underline" onClick={() => setStep('input')} disabled={loading}>Change details</button>
                    <button type="button" className="text-indigo-600 hover:underline" onClick={handleRequestOtp} disabled={loading}>Resend OTP</button>
                  </div>
                  <button className="btn btn-primary w-full text-lg" disabled={loading || otp.length !== 6}>{loading ? 'Verifying…' : 'Verify & Login'}</button>
                </form>
              )}

              <p className="text-xs text-gray-500 text-center">Demo uses a mock ABHA service. OTP logs to console.</p>
            </div>
          </div>
        </div>
      </div>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </div>
  )
}



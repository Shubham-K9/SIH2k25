// Mock ABHA 2.0 authentication service
// Replace with real API integration later

export async function initiateAbhaLogin() {
  // simulate network delay
  await new Promise((r) => setTimeout(r, 800))
  // randomly succeed or fail for demo
  const success = Math.random() > 0.15
  if (!success) {
    const error = new Error('ABHA authentication failed. Please try again.')
    error.code = 'ABHA_AUTH_FAILED'
    throw error
  }
  // return a fake JWT token-like string
  return {
    token: `fake_abha_token_${Math.random().toString(36).slice(2)}`,
    user: { id: '12345', name: 'ABHA User' }
  }
}

// --- Demo ABHA OTP flow (mock) ---
// requestOtp accepts either abhaAddress or mobile
export async function requestOtp({ abhaAddress, mobile }) {
  await new Promise((r) => setTimeout(r, 700))
  if (!abhaAddress && !mobile) {
    const error = new Error('Provide ABHA address or mobile number')
    error.code = 'ABHA_INPUT_REQUIRED'
    throw error
  }
  const txnId = `txn_${Math.random().toString(36).slice(2)}`
  // for demo, OTP is fixed and shown in console to simulate SMS delivery
  const otp = String(100000 + Math.floor(Math.random() * 900000))
  // eslint-disable-next-line no-console
  console.info(`[DEMO] OTP for ${abhaAddress || mobile}: ${otp} (txnId: ${txnId})`)
  return { txnId, masked: mobile ? maskMobile(mobile) : maskAbha(abhaAddress) , demoOtp: otp }
}

export async function verifyOtp({ txnId, otp }) {
  await new Promise((r) => setTimeout(r, 700))
  if (!txnId || !otp) {
    const error = new Error('Transaction and OTP are required')
    error.code = 'ABHA_VERIFY_REQUIRED'
    throw error
  }
  const ok = otp && otp.length === 6
  if (!ok) {
    const error = new Error('Invalid OTP')
    error.code = 'ABHA_INVALID_OTP'
    throw error
  }
  return {
    token: `fake_abha_token_${Math.random().toString(36).slice(2)}`,
    user: { id: '12345', name: 'ABHA User' }
  }
}

function maskMobile(mobile) {
  const s = String(mobile)
  if (s.length < 4) return '****'
  return `${'*'.repeat(Math.max(0, s.length - 4))}${s.slice(-4)}`
}

function maskAbha(addr) {
  if (!addr) return '****'
  const [name, domain] = String(addr).split('@')
  const maskedName = name ? name[0] + '*'.repeat(Math.max(0, name.length - 2)) + name.slice(-1) : '****'
  return `${maskedName}@${domain || 'abdm'}`
}



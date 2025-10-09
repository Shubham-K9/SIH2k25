import React, { useEffect, useState } from 'react'

export default function Toast({ message, type = 'info', duration = 2500, onClose }) {
  const [open, setOpen] = useState(Boolean(message))
  useEffect(() => {
    if (!message) return
    setOpen(true)
    const t = setTimeout(() => {
      setOpen(false)
      onClose?.()
    }, duration)
    return () => clearTimeout(t)
  }, [message, duration, onClose])

  if (!open) return null
  const color = type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-emerald-600' : ''

  return (
    <div className={`toast ${color}`} role="status">
      {message}
    </div>
  )
}



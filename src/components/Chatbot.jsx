import React, { useEffect, useMemo, useRef, useState } from 'react'

// Lightweight floating chatbot with FAQ and local history
export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('chatbot_messages')
      return saved ? JSON.parse(saved) : [
        { role: 'assistant', text: "Hello, I'm your chatbot assistant. How can I help you?" }
      ]
    } catch {
      return [{ role: 'assistant', text: "Hello, I'm your chatbot assistant. How can I help you?" }]
    }
  })

  const containerRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('chatbot_messages', JSON.stringify(messages))
  }, [messages])

  const faqs = useMemo(() => ([
    { q: 'How to search diagnosis?', a: 'Go to Diagnosis page and start typing. Use filters for category/AYUSH.' },
    { q: 'Why am I seeing no results?', a: 'Ensure you are logged in. If issues persist, verify backend health from the status indicator.' },
    { q: 'How to create ABHA?', a: 'Open ABHA Settings and follow on-screen steps to authenticate and link your ABHA.' },
    { q: 'Where are my past visits?', a: 'Check Patient Records for your previous visits and prescriptions.' }
  ]), [])

  function sendMessage(text) {
    if (!text.trim()) return
    const userMsg = { role: 'user', text: text.trim() }
    setMessages(prev => [...prev, userMsg])

    // Very basic heuristic responder using FAQs
    const match = faqs.find(f => text.toLowerCase().includes(f.q.split(' ')[0].toLowerCase()))
    const reply = match ? match.a : 'I noted your query. For advanced help, please check Backend Status and Diagnosis page. '
    const assistantMsg = { role: 'assistant', text: reply }

    setTimeout(() => {
      setMessages(prev => [...prev, assistantMsg])
    }, 200)

    setInput('')
  }

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.scrollTop = containerRef.current.scrollHeight
  }, [messages, open])

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button
        aria-label="Open help chatbot"
        onClick={() => setOpen(o => !o)}
        className="group relative h-12 w-12 rounded-full bg-gradient-to-tr from-fuchsia-500 via-sky-500 to-emerald-400 shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-300/40"
      >
        <span className="absolute inset-0 rounded-full animate-pulse bg-white/0 group-hover:bg-white/10" />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-6 w-6 m-auto">
          <path d="M2 12c0-4.97 4.48-9 10-9s10 4.03 10 9-4.48 9-10 9c-1.1 0-2.16-.16-3.14-.47-.21-.06-.43-.04-.62.06L4.4 22.2c-.58.3-1.26-.28-1.05-.9l1.08-3.16c.07-.2.06-.43-.04-.62C3.35 16.2 2 14.23 2 12z" />
        </svg>
      </button>

      {open && (
        <div className="mt-3 w-[22rem] overflow-hidden rounded-2xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-md">
          <div className="relative h-16">
            <div className="absolute inset-0 animate-gradient-pan bg-[conic-gradient(at_20%_20%,#0ea5e9_0deg,#a855f7_120deg,#22d3ee_240deg,#0ea5e9_360deg)]" />
            <div className="absolute inset-0 bg-white/70" />
            <div className="relative flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                {/* Robot image if provided, else fall back to inline SVG */}
                <img src="/robot.png" alt="Chatbot" className="h-6 w-6" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'inline-block' }} />
                <svg viewBox="0 0 24 24" className="hidden h-6 w-6 text-sky-600" aria-hidden="true">
                  <rect x="4" y="9" width="16" height="10" rx="2" fill="currentColor" opacity="0.15" />
                  <circle cx="12" cy="6" r="3" fill="currentColor" />
                  <circle cx="9" cy="14" r="1.5" fill="currentColor" />
                  <circle cx="15" cy="14" r="1.5" fill="currentColor" />
                </svg>
                <div className="font-semibold text-gray-800">Assistant</div>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-white/70">Close</button>
            </div>
          </div>

          {/* Welcome banner (always visible on open) */}
          <div className="px-4 py-2 bg-gradient-to-r from-sky-50 to-emerald-50 text-xs text-gray-700 border-t border-b border-gray-100">
            Hello, I'm your chatbot assistant. How can I help you?
          </div>

          <div ref={containerRef} className="max-h-72 space-y-2 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={
                  'inline-block max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow ' +
                  (m.role === 'user' ? 'bg-sky-600 text-white' : 'bg-white text-gray-800 border border-gray-100')
                }>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 bg-white/80 p-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(input) }}
                placeholder="Type your question..."
                className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300/30"
              />
              <button
                onClick={() => sendMessage(input)}
                className="rounded-xl bg-sky-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-sky-700"
              >Send</button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {faqs.slice(0, 3).map((f, idx) => (
                <button key={idx} onClick={() => sendMessage(f.q)} className="rounded-full border border-gray-200 bg-white/70 px-3 py-1 text-xs text-gray-700 hover:bg-white">{f.q}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

export default function Home() {
  const navigate = useNavigate()
  const MenuButton = ({ to, onClick, children, tone = 'primary' }) => (
    <button
      onClick={() => (onClick ? onClick() : navigate(to))}
      className={`btn w-full text-lg ${tone === 'primary' ? 'btn-primary' : ''} ${tone === 'neutral' ? 'bg-white border hover:bg-gray-50' : ''} ${tone === 'accent' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : ''}`}
    >
      {children}
    </button>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50">
      <Navbar />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
        {/* Assistant greeting (Home-only) - compact box in bottom right */}
        <div className="fixed bottom-24 right-4 z-50 w-48 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-2 shadow-lg backdrop-blur">
          <div className="flex items-center gap-2">
            <img
              src="/robot.png"
              alt="Assistant"
              className="h-6 w-6 flex-shrink-0"
              onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'inline-block' }}
            />
            <svg viewBox="0 0 24 24" className="hidden h-6 w-6 text-white flex-shrink-0" aria-hidden="true">
              <rect x="4" y="9" width="16" height="10" rx="2" fill="currentColor" opacity="0.15" />
              <circle cx="12" cy="6" r="3" fill="currentColor" />
              <circle cx="9" cy="14" r="1.5" fill="currentColor" />
              <circle cx="15" cy="14" r="1.5" fill="currentColor" />
            </svg>
            <div className="text-xs font-medium text-white leading-tight">
              Hi, How can I help?
            </div>
          </div>
        </div>
        {/* Hero (Integrations) - premium look with live gradient */}
        <section className="relative overflow-hidden rounded-2xl px-6 py-7 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white shadow-xl">
          <div className="absolute inset-0 opacity-10 [mask-image:radial-gradient(60%_60%_at_50%_40%,#000_40%,transparent_100%)]">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#0f172a" strokeOpacity="0.2" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div className="relative z-10 grid gap-6 sm:grid-cols-2 sm:items-center">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
                <span>ABDM • ABHA • FHIR R4</span>
              </div>
              <h2 className="text-2xl font-extrabold sm:text-3xl text-white">Integrations (Core)</h2>
              <p className="mt-2 text-white/90">FHIR-compliant flows for India's Ayush sector with secure OAuth 2.0.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <MenuButton to="/diagnosis" tone="accent">🩺 Diagnosis Entry</MenuButton>
                <button
                  onClick={() => navigate('/upload-encounter')}
                  className="btn bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  📤 Upload Encounter
                </button>
                <a href="#integrations-details" className="btn border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 transition-colors">Learn more</a>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-lg bg-white/20 backdrop-blur px-3 py-2 ring-1 ring-white/30">
                  <div className="text-xs text-white/70">Security</div>
                  <div className="font-semibold text-white">OAuth 2.0</div>
                </div>
                <div className="rounded-lg bg-white/20 backdrop-blur px-3 py-2 ring-1 ring-white/30">
                  <div className="text-xs text-white/70">Compliance</div>
                  <div className="font-semibold text-white">FHIR R4</div>
                </div>
                <div className="rounded-lg bg-white/20 backdrop-blur px-3 py-2 ring-1 ring-white/30">
                  <div className="text-xs text-white/70">Coverage</div>
                  <div className="font-semibold text-white">Ayush</div>
                </div>
              </div>
            </div>
            <div className="hidden sm:block justify-self-end">
              <div className="h-32 w-32 rounded-2xl overflow-hidden ring-1 ring-white/60 shadow-lg">
                <img 
                  src="/LoginPic.jpg" 
                  alt="Integration Visual" 
                  className="h-full w-full object-cover"
                  onError={(e) => { 
                    e.currentTarget.style.display = 'none'; 
                    e.currentTarget.parentElement.innerHTML = '<div class="h-full w-full bg-gradient-to-br from-sky-200 via-fuchsia-200 to-emerald-200 rounded-2xl"></div>';
                  }}
                />
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-200/60 blur-2xl"></div>
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-emerald-200/60 blur-2xl"></div>
        </section>

        {/* Quick Actions */}
        <section>
          <h3 className="mb-3 text-xl font-bold text-gray-900">Quick Actions</h3>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <button className="rounded-xl border bg-white px-4 py-3 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:shadow md:text-base" onClick={() => alert('Claim Insurance flow (coming soon)')}>🧾 Claim Insurance</button>
            <button className="rounded-xl border bg-white px-4 py-3 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:shadow md:text-base" onClick={() => alert('Calling doctor… (demo)')}>📞 Call Doctor</button>
            <button className="rounded-xl border bg-white px-4 py-3 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:shadow md:text-base" onClick={() => navigate('/patient-records')}>🧪 Check Report</button>
            <button className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow md:text-base">🚨 Emergency</button>
            <button className="rounded-xl border bg-white px-4 py-3 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:shadow md:text-base" onClick={() => alert('Redirecting to pharmacy… (demo)')}>💊 Buy Medicine</button>
          </div>
        </section>

        

        {/* Modules - bold, interactive cards */}
        <section className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3">
{/* Combined: Patient Care Hub - Taller & More Balanced */}
<div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-teal-50 p-8 shadow-sm ring-1 ring-transparent transition-all duration-700 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-200/30 hover:ring-blue-100 col-span-2 min-h-[280px] max-w-4xl cursor-pointer">
  
  {/* Gentle healing glow overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-teal-50/0 to-green-50/0 opacity-0 transition-all duration-1000 group-hover:from-blue-50/40 group-hover:via-teal-50/20 group-hover:to-green-50/40 group-hover:opacity-100 rounded-2xl"></div>
  
  {/* Soft floating particles */}
  <div className="absolute top-4 right-4 h-1.5 w-1.5 rounded-full bg-blue-200 opacity-0 transition-all duration-1500 group-hover:animate-bounce group-hover:opacity-60"></div>
  <div className="absolute top-8 right-8 h-1 w-1 rounded-full bg-teal-200 opacity-0 transition-all duration-1500 delay-300 group-hover:animate-pulse group-hover:opacity-70"></div>
  <div className="absolute top-12 right-6 h-1 w-1 rounded-full bg-green-200 opacity-0 transition-all duration-1500 delay-150 group-hover:animate-ping group-hover:opacity-50"></div>
  
  <div className="relative z-10 h-full flex flex-col justify-between">
    {/* Header Section */}
    <div className="mb-6 flex items-center gap-4">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 border border-blue-100 text-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
        <span className="transition-all duration-500 group-hover:animate-pulse">🏥</span>
      </span>
      <div className="transition-all duration-400 group-hover:translate-x-2">
        <h3 className="text-2xl font-bold text-slate-700 transition-all duration-500 group-hover:text-blue-600 mb-1">
          Patient Care Hub
        </h3>
        <p className="text-base text-slate-600 transition-all duration-400 group-hover:text-blue-600">
          Compassionate care, simplified workflow ✨
        </p>
      </div>
    </div>
    
    {/* Primary Actions - Bigger Buttons */}
    <div className="mb-6 grid gap-4 sm:grid-cols-2">
      <MenuButton 
        to="/add-patient" 
        className="relative overflow-hidden bg-gradient-to-r from-blue-400 to-blue-500 text-white transition-all duration-400 hover:from-blue-500 hover:to-blue-600 hover:scale-105 hover:shadow-lg px-6 py-4 text-lg font-semibold"
      >
        <span className="flex items-center justify-center gap-3">
          <span className="text-xl">👤</span>
          New Patient
        </span>
      </MenuButton>
      
      <MenuButton 
        to="/patient-records" 
        className="relative overflow-hidden bg-gradient-to-r from-teal-400 to-teal-500 text-white transition-all duration-400 hover:from-teal-500 hover:to-teal-600 hover:scale-105 hover:shadow-lg px-6 py-4 text-lg font-semibold"
      >
        <span className="flex items-center justify-center gap-3">
          <span className="text-xl">📊</span>
          Patient Records
        </span>
      </MenuButton>
    </div>
    
    {/* Secondary Actions - Better Spacing */}
    <div className="grid gap-3 sm:grid-cols-3">
      <MenuButton 
        to="/reports" 
        tone="neutral" 
        className="text-sm py-3 px-4 transition-all duration-400 hover:scale-105 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm border hover:border-blue-200"
      >
        <span className="text-lg">📈</span>
        <span className="block mt-1 font-medium">Health Reports</span>
      </MenuButton>
      <MenuButton 
        to="/claims" 
        tone="neutral" 
        className="text-sm py-3 px-4 transition-all duration-400 hover:scale-105 hover:bg-teal-50 hover:text-teal-700 hover:shadow-sm border hover:border-teal-200"
      >
        <span className="text-lg">💼</span>
        <span className="block mt-1 font-medium">Insurance</span>
      </MenuButton>
      <MenuButton 
        to="/consults" 
        tone="neutral" 
        className="text-sm py-3 px-4 transition-all duration-400 hover:scale-105 hover:bg-green-50 hover:text-green-700 hover:shadow-sm border hover:border-green-200"
      >
        <span className="text-lg">🩺</span>
        <span className="block mt-1 font-medium">Consultations</span>
      </MenuButton>
    </div>
  </div>
</div>



{/* Prescriptions Block - EXACT MATCHING Background */}
<div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-teal-50 p-6 shadow-sm ring-1 ring-transparent transition-all duration-700 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-200/30 hover:ring-blue-100 cursor-pointer">
  
  {/* Gentle healing glow overlay - SAME AS PATIENT HUB */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-teal-50/0 to-green-50/0 opacity-0 transition-all duration-1000 group-hover:from-blue-50/40 group-hover:via-teal-50/20 group-hover:to-green-50/40 group-hover:opacity-100 rounded-2xl"></div>
  
  {/* Soft floating particles - SAME AS PATIENT HUB */}
  <div className="absolute top-4 right-4 h-1.5 w-1.5 rounded-full bg-blue-200 opacity-0 transition-all duration-1500 group-hover:animate-bounce group-hover:opacity-60"></div>
  <div className="absolute top-8 right-8 h-1 w-1 rounded-full bg-teal-200 opacity-0 transition-all duration-1500 delay-300 group-hover:animate-pulse group-hover:opacity-70"></div>
  <div className="absolute top-12 right-6 h-1 w-1 rounded-full bg-green-200 opacity-0 transition-all duration-1500 delay-150 group-hover:animate-ping group-hover:opacity-50"></div>
  
  <div className="relative z-10">
    {/* Header Section - SAME STYLING */}
    <div className="mb-6 flex items-center gap-3">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 border border-blue-100 text-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
        <span className="transition-all duration-500 group-hover:animate-pulse">💊</span>
      </span>
      <div className="transition-all duration-400 group-hover:translate-x-1">
        <h3 className="text-xl font-bold text-slate-700 transition-all duration-500 group-hover:text-blue-600 mb-1">
          Prescriptions & Diagnosis
        </h3>
        <p className="text-sm text-slate-600 transition-all duration-400 group-hover:text-blue-600">
          Manage prescriptions and diagnosis entries ⚕️
        </p>
      </div>
    </div>
    
    {/* Primary Actions - SAME STYLING */}
    <div className="grid gap-3">
      <MenuButton 
        to="/prescriptions"
        className="relative overflow-hidden bg-gradient-to-r from-blue-400 to-blue-500 text-white transition-all duration-400 hover:from-blue-500 hover:to-blue-600 hover:scale-105 hover:shadow-lg px-6 py-4 text-base font-semibold rounded-lg"
      >
        <span className="flex items-center justify-center gap-3">
          <span className="text-lg">💊</span>
          Prescriptions
        </span>
      </MenuButton>
      
      <MenuButton 
        to="/diagnosis" 
        tone="neutral" 
        className="transition-all duration-400 hover:scale-105 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm border hover:border-blue-200 px-6 py-3 rounded-lg"
      >
        <span className="flex items-center justify-center gap-3">
          <span className="text-lg">🩺</span>
          <span>Diagnosis Entry</span>
        </span>
      </MenuButton>
    </div>
  </div>
</div>



{/* ABHA & Settings Block - EXACT BUTTON FIX */}
<div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-teal-50 p-6 shadow-sm ring-1 ring-transparent transition-all duration-700 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-200/30 hover:ring-blue-100 cursor-pointer sm:col-span-2 lg:col-span-1">
  
  {/* Particles and overlays */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-teal-50/0 to-green-50/0 opacity-0 transition-all duration-1000 group-hover:from-blue-50/40 group-hover:via-teal-50/20 group-hover:to-green-50/40 group-hover:opacity-100 rounded-2xl"></div>
  <div className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-blue-200 opacity-0 transition-all duration-1500 group-hover:animate-bounce group-hover:opacity-60"></div>
  <div className="absolute top-6 right-6 h-1 w-1 rounded-full bg-teal-200 opacity-0 transition-all duration-1500 delay-300 group-hover:animate-pulse group-hover:opacity-70"></div>
  
  <div className="relative z-10">
    {/* Header */}
    <div className="mb-6 flex items-center gap-3">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 border border-blue-100 text-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
        <span className="transition-all duration-500 group-hover:animate-pulse">🛡️</span>
      </span>
      <div className="transition-all duration-400 group-hover:translate-x-1">
        <h3 className="text-xl font-bold text-slate-700 transition-all duration-500 group-hover:text-blue-600 mb-1">
          ABHA & Settings
        </h3>
        <p className="text-sm text-slate-600 transition-all duration-400 group-hover:text-blue-600">
          Secure identity and preferences 🔐
        </p>
      </div>
    </div>
    
    {/* FIXED BUTTONS - REMOVE OLD CLASSES COMPLETELY */}
    <div className="grid gap-3">
      {/* PRIMARY BUTTON - EXACT MATCH */}
      <button 
        className="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3 text-base"
        onClick={() => navigate('/abha-settings')}
      >
        <span className="text-lg">🆔</span>
        ABHA Settings
      </button>
      
      {/* SECONDARY BUTTON - EXACT MATCH */}
      <button 
        className="w-full bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 border border-gray-200 hover:border-blue-200 hover:shadow-sm flex items-center justify-center gap-3 text-base"
        onClick={() => navigate('/preferences')}
      >
        <span className="text-lg">⚙️</span>
        Preferences
      </button>
    </div>
  </div>
</div>



{/* User Guidelines Block - Full width on large screens */}
<div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-teal-50 p-6 shadow-sm ring-1 ring-transparent transition-all duration-700 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-200/30 hover:ring-blue-100 cursor-pointer sm:col-span-2 lg:col-span-3">
  
  {/* Gentle healing glow overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-teal-50/0 to-green-50/0 opacity-0 transition-all duration-1000 group-hover:from-blue-50/40 group-hover:via-teal-50/20 group-hover:to-green-50/40 group-hover:opacity-100 rounded-2xl"></div>
  
  {/* Soft floating particles */}
  <div className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-blue-200 opacity-0 transition-all duration-1500 group-hover:animate-bounce group-hover:opacity-60"></div>
  <div className="absolute top-6 right-6 h-1 w-1 rounded-full bg-teal-200 opacity-0 transition-all duration-1500 delay-300 group-hover:animate-pulse group-hover:opacity-70"></div>
  
  <div className="relative z-10">
    {/* Header Section - Matching ABHA */}
    <div className="mb-6 flex items-center gap-3">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 border border-blue-100 text-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
        <span className="transition-all duration-500 group-hover:animate-pulse">📋</span>
      </span>
      <div className="transition-all duration-400 group-hover:translate-x-1">
        <h3 className="text-xl font-bold text-slate-700 transition-all duration-500 group-hover:text-blue-600 mb-1">
          User Guidelines
        </h3>
        <p className="text-sm text-slate-600 transition-all duration-400 group-hover:text-blue-600">
          Quick workflow and system guide 📖
        </p>
      </div>
    </div>
    
    {/* Guidelines Content - Horizontal layout (equal thirds) */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
      {/* Quick Steps - Compact */}
      <div className="bg-white/60 rounded-lg p-3 border border-blue-100/50 h-full">
        <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2 text-sm">
          <span className="text-blue-500">🚀</span> Quick Start
        </h4>
        <ol className="text-xs text-slate-600 space-y-0.5 list-decimal list-inside">
          <li>Add new patient information</li>
          <li>Record diagnosis using NAMASTE codes</li>
          <li>Generate prescriptions</li>
          <li>Update patient records</li>
        </ol>
      </div>
      
      {/* NAMASTE Integration - Compact */}
      <div className="bg-white/60 rounded-lg p-3 border border-blue-100/50 h-full">
        <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2 text-sm">
          <span className="text-teal-500">🧬</span> NAMASTE Integration
        </h4>
        <ul className="text-xs text-slate-600 space-y-0.5">
          <li>• Auto-translate AYUSH to ICD-11 codes</li>
          <li>• Search traditional medicine terms</li>
          <li>• Dual coding compliance</li>
        </ul>
      </div>
      
      {/* Quick Help Button - Matching Style */}
      <button className="w-full h-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 text-sm">
        <span>❓</span>
        Need Help?
      </button>
    </div>
  </div>
</div>



        </section>

        {/* Insurance / Integrations Cards Row (moved to end) */}
        <section aria-label="Insurance and Network" className="mt-4">
          <div className="grid gap-3 lg:grid-cols-4">
            {/* E-Card */}
            <button
              onClick={() => alert('E-Card: Get e-cards for you and your family members')}
              className="insurance-card group w-full rounded-2xl border border-gray-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
              aria-label="E-Card, Get e-cards for you and your family members"
            >
              <div className="wave-section-card cursor-pointer">
                <div className="bold m-b-15 mdTxt mb-2 w-4/5 text-base font-bold text-gray-900">E-Card</div>
                <div className="mb-4 text-sm text-gray-700">Get e-cards for you and your family members</div>
                <div className="flex items-center justify-between">
                  <svg xmlns="http://www.w3.org/2000/svg" role="presentation" height="15" viewBox="0 0 23.276 24.191" className="text-blue-600">
                    <g fill="none" stroke="#2563eb" strokeLinecap="round" strokeWidth="2">
                      <path strokeLinejoin="round" d="M-115.449 5076.147l10.465 10.974-6.718 6.56-3.747 3.83" transform="translate(-4.744 1.414) translate(132.004 -5076.147)"></path>
                      <path d="M-94.468 5083.2h-20.44" transform="translate(-4.744 1.414) translate(120.652 -5072.304)"></path>
                    </g>
                  </svg>
                  <div className="h-10 w-10 rounded bg-blue-50"></div>
                </div>
              </div>
            </button>

            {/* Claims */}
            <button
              onClick={() => alert('Claims: Submit and track claims')}
              className="insurance-card group w-full rounded-2xl border border-gray-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
              aria-label="Claims, Submit and track claims"
            >
              <div className="bold m-b-15 mdTxt mb-2 w-4/5 text-base font-bold text-gray-900">Claims</div>
              <div className="mb-4 text-sm text-gray-700">Submit and track your insurance claims</div>
              <div className="flex items-center justify-between">
                <svg xmlns="http://www.w3.org/2000/svg" role="presentation" height="15" viewBox="0 0 23.276 24.191" className="text-blue-600">
                  <g fill="none" stroke="#2563eb" strokeLinecap="round" strokeWidth="2">
                    <path strokeLinejoin="round" d="M-115.449 5076.147l10.465 10.974-6.718 6.56-3.747 3.83" transform="translate(-4.744 1.414) translate(132.004 -5076.147)"></path>
                    <path d="M-94.468 5083.2h-20.44" transform="translate(-4.744 1.414) translate(120.652 -5072.304)"></path>
                  </g>
                </svg>
                <div className="h-10 w-10 rounded bg-blue-50"></div>
              </div>
            </button>

            {/* Network Hospitals */}
            <button
              onClick={() => alert('Network Hospitals: Explore cashless network hospitals')}
              className="insurance-card group w-full rounded-2xl border border-gray-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
              aria-label="Network Hospitals, Explore cashless network hospitals"
            >
              <div className="bold m-b-15 mdTxt mb-2 w-4/5 text-base font-bold text-gray-900">Network Hospitals</div>
              <div className="mb-4 text-sm text-gray-700">Explore cashless network hospitals near you</div>
              <div className="flex items-center justify-between">
                <svg xmlns="http://www.w3.org/2000/svg" role="presentation" height="15" viewBox="0 0 23.276 24.191" className="text-blue-600">
                  <g fill="none" stroke="#2563eb" strokeLinecap="round" strokeWidth="2">
                    <path strokeLinejoin="round" d="M-115.449 5076.147l10.465 10.974-6.718 6.56-3.747 3.83" transform="translate(-4.744 1.414) translate(132.004 -5076.147)"></path>
                    <path d="M-94.468 5083.2h-20.44" transform="translate(-4.744 1.414) translate(120.652 -5072.304)"></path>
                  </g>
                </svg>
                <div className="h-10 w-10 rounded bg-blue-50"></div>
              </div>
            </button>

            {/* Empanel Hospital */}
            <button
              onClick={() => alert('Empanel Hospital: Get your hospital empanelled')}
              className="insurance-card group w-full rounded-2xl border border-gray-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
              aria-label="Empanel Hospital, Get your hospital empanelled"
            >
              <div className="bold m-b-15 mdTxt mb-2 w-4/5 text-base font-bold text-gray-900">Empanel Hospital</div>
              <div className="mb-4 text-sm text-gray-700">Get your hospital empanelled for cashless claims</div>
              <div className="flex items-center justify-between">
                <svg xmlns="http://www.w3.org/2000/svg" role="presentation" height="15" viewBox="0 0 23.276 24.191" className="text-blue-600">
                  <g fill="none" stroke="#2563eb" strokeLinecap="round" strokeWidth="2">
                    <path strokeLinejoin="round" d="M-115.449 5076.147l10.465 10.974-6.718 6.56-3.747 3.83" transform="translate(-4.744 1.414) translate(132.004 -5076.147)"></path>
                    <path d="M-94.468 5083.2h-20.44" transform="translate(-4.744 1.414) translate(120.652 -5072.304)"></path>
                  </g>
                </svg>
                <div className="h-10 w-10 rounded bg-blue-50"></div>
              </div>
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}



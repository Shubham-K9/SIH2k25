import React from 'react'

export default function Footer() {
  return (
    <footer className="mt-10 border-t bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-fuchsia-500 to-emerald-400" />
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <nav aria-label="Health" className="space-y-3">
            <div className="text-sm font-semibold text-emerald-300">Health</div>
            <a className="block text-sm text-slate-300 hover:text-white hover:underline" href="#">MediBuddy Gold</a>
            <a className="block text-sm text-slate-300 hover:text-white hover:underline" href="#">Book Medicines</a>
            <a className="block text-sm text-slate-300 hover:text-white hover:underline" href="#">Doctor Consultation</a>
            <a className="block text-sm text-slate-300 hover:text-white hover:underline" href="#">Book a Lab test</a>
            <a className="block text-sm text-slate-300 hover:text-white hover:underline" href="#">Covid Essential Items</a>
            <a className="block text-sm text-slate-300 hover:text-white hover:underline" href="#">Surgery Care</a>
            <a className="block text-sm text-slate-300 hover:text-white hover:underline" href="#">Dental</a>
            <a className="block text-sm text-slate-300 hover:text-white hover:underline" href="#">Cancer Care</a>
            <a className="block text-sm text-slate-300 hover:text-white hover:underline" href="#">Partner with MediBuddy</a>
          </nav>

          <nav aria-label="Hospitalization" className="space-y-3">
            <div className="text-sm font-semibold text-sky-300">Hospitalization</div>
            <a className="block text-sm text-slate-300 hover:text-white hover:underline" href="#">Locate hospital</a>
            <div className="text-sm text-slate-400">Download: <a className="text-sky-300 hover:underline" href="#">eCard</a></div>
            <a className="block text-sm text-slate-300 hover:text-white hover:underline" href="#">Track claim</a>
            <a className="block text-sm text-slate-300 hover:text-white hover:underline" href="#">FAQs</a>
            <div className="text-sm font-semibold text-fuchsia-300 mt-2">Our Policies</div>
            <div className="grid grid-cols-1 gap-2">
              <a className="text-sm text-slate-300 hover:text-white hover:underline" href="#">Terms of Use</a>
              <a className="text-sm text-slate-300 hover:text-white hover:underline" href="#">Privacy Policy</a>
              <a className="text-sm text-slate-300 hover:text-white hover:underline" href="#">Grievance Redressal</a>
              <a className="text-sm text-slate-300 hover:text-white hover:underline" href="#">Cancellation & Refund Policy</a>
              <a className="text-sm text-slate-300 hover:text-white hover:underline" href="#">Security at MediBuddy</a>
            </div>
          </nav>

          <nav aria-label="About" className="space-y-3">
            <div className="text-sm font-semibold text-amber-300">About</div>
            <a className="block text-sm text-slate-300 hover:text-white hover:underline" href="#">Overview</a>
            <a className="block text-sm text-slate-300 hover:text-white hover:underline" href="#">Tailored Corporate Plans</a>
            <a className="block text-sm text-slate-300 hover:text-white hover:underline" href="#">Testimonials</a>
            <a className="block text-sm text-slate-300 hover:text-white hover:underline" href="#">Contact</a>
            <a className="block text-sm text-slate-300 hover:text-white hover:underline" href="#">Blog</a>
            <a className="block text-sm text-slate-300 hover:text-white hover:underline" href="#">Careers</a>
            <a className="block text-sm text-slate-300 hover:text-white hover:underline" href="#">Security</a>
            <a className="block text-sm text-slate-300 hover:text-white hover:underline" href="#">Medical Value Travel Facilitator</a>
            <a className="block text-sm text-slate-300 hover:text-white hover:underline" href="#">MediBuddy Beliefs</a>
          </nav>

          <div className="space-y-4">
            <div>
              <div className="label m-b-5 smdTxt text-xs text-slate-400">Download app</div>
              <div className="flex items-center gap-3">
                <a className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-slate-100 hover:bg-white/20" href="#">Android</a>
                <a className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-slate-100 hover:bg-white/20" href="#">iOS</a>
              </div>
            </div>
            <div>
              <div className="label m-b-5 smdTxt text-xs text-slate-400">Follow us</div>
              <div className="flex items-center gap-3">
                <a className="rounded-full bg-sky-500/20 px-3 py-1 text-xs text-sky-200 hover:bg-sky-500/30" href="#" aria-label="Facebook">Facebook</a>
                <a className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-200 hover:bg-blue-500/30" href="#" aria-label="LinkedIn">LinkedIn</a>
                <a className="rounded-full bg-fuchsia-500/20 px-3 py-1 text-xs text-fuchsia-200 hover:bg-fuchsia-500/30" href="#" aria-label="Twitter">Twitter</a>
                <a className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-200 hover:bg-emerald-500/30" href="#" aria-label="Blog">Blog</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-xs text-slate-400">
          © {new Date().getFullYear()} MediBuddy-inspired footer. Demo only.
        </div>
      </div>
    </footer>
  )
}



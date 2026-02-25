'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, RefreshCw } from 'lucide-react'

export default function ClearSessionPage() {
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    // Clear all authentication cookies
    const cookies = document.cookie.split(';')

    for (let cookie of cookies) {
      const [name] = cookie.split('=')
      const trimmedName = name.trim()

      // Delete the cookie by setting it to expire in the past
      if (trimmedName.includes('next-auth') || trimmedName.includes('session')) {
        document.cookie = `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
        document.cookie = `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`
      }
    }

    setCleared(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
        {cleared ? (
          <>
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Session Cleared!</h2>
            <p className="text-slate-300 mb-8">
              Your session cookies have been cleared. You can now access the site normally.
            </p>
            <Link
              href="/auth/login"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all"
            >
              Go to Login
            </Link>
          </>
        ) : (
          <>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Clearing Session...</h2>
            <p className="text-slate-400">Removing corrupted session data</p>
          </>
        )}
      </div>
    </div>
  )
}

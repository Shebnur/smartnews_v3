'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function SessionTestPage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
        <h1 className="text-3xl font-bold text-white mb-6">Session Test Page</h1>

        <div className="space-y-4">
          {/* Status */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h2 className="text-sm font-semibold text-slate-400 mb-2">Status</h2>
            <div className="flex items-center gap-2">
              {status === 'loading' && (
                <>
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  <span className="text-white">Loading...</span>
                </>
              )}
              {status === 'authenticated' && (
                <>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Authenticated ✅</span>
                </>
              )}
              {status === 'unauthenticated' && (
                <>
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span className="text-white">Not Authenticated ❌</span>
                </>
              )}
            </div>
          </div>

          {/* Session Data */}
          {session && (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h2 className="text-sm font-semibold text-slate-400 mb-2">Session Data</h2>
              <div className="space-y-2 text-white">
                <p><span className="text-slate-400">User ID:</span> {session.user?.id}</p>
                <p><span className="text-slate-400">Email:</span> {session.user?.email}</p>
                <p><span className="text-slate-400">Name:</span> {session.user?.name || 'Not set'}</p>
                <p><span className="text-slate-400">Expires:</span> {session.expires}</p>
              </div>
            </div>
          )}

          {/* JSON Output */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h2 className="text-sm font-semibold text-slate-400 mb-2">Raw Session JSON</h2>
            <pre className="text-xs text-slate-300 overflow-auto bg-black/30 p-3 rounded">
              {JSON.stringify({ status, session }, null, 2)}
            </pre>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link
              href="/profile"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors text-center"
            >
              Go to Profile
            </Link>
            <Link
              href="/"
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-lg transition-colors text-center border border-white/20"
            >
              Go to Homepage
            </Link>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-200 text-sm">
              <strong>Note:</strong> This page checks if your session is working. If you see "Authenticated ✅" above, your login is working correctly.
              If clicking "Go to Profile" redirects you to login, there's an issue with the middleware.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

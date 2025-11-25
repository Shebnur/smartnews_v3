'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { User, LogOut, UserCircle } from 'lucide-react'
import { useState } from 'react'

export default function AuthNav() {
  const { data: session, status } = useSession()
  const [showMenu, setShowMenu] = useState(false)

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-slate-700 rounded-full animate-pulse" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/auth/login"
          className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
        >
          Log In
        </Link>
        <Link
          href="/auth/signup"
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
        >
          Sign Up
        </Link>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all"
      >
        <UserCircle className="w-5 h-5 text-slate-300" />
        <span className="text-slate-300 text-sm">{session.user?.email}</span>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
            <div className="p-2">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition-all"
                onClick={() => setShowMenu(false)}
              >
                <User className="w-4 h-4" />
                My Profile
              </Link>
              <button
                onClick={() => {
                  setShowMenu(false)
                  signOut({ callbackUrl: '/auth/login' })
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-slate-700 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { User, LogOut, UserCircle, LogIn, UserPlus } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

export default function AuthNav() {
  const { data: session, status } = useSession()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (status === 'loading') {
    return (
      <div className="w-10 h-10 bg-white/5 rounded-full animate-pulse" />
    )
  }

  if (!session) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-all border border-white/10 hover:border-white/20"
        >
          <UserCircle className="w-6 h-6 text-slate-300" />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-slate-700">
              <p className="text-sm text-slate-400">Welcome to SmartNews</p>
            </div>
            <div className="p-2">
              <Link
                href="/auth/login"
                className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-purple-500/10 hover:text-white rounded-lg transition-all group"
                onClick={() => setShowMenu(false)}
              >
                <div className="w-8 h-8 bg-purple-500/20 group-hover:bg-purple-500/30 rounded-lg flex items-center justify-center">
                  <LogIn className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="font-medium">Log In</div>
                  <div className="text-xs text-slate-500">Access your account</div>
                </div>
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-pink-500/10 hover:text-white rounded-lg transition-all group"
                onClick={() => setShowMenu(false)}
              >
                <div className="w-8 h-8 bg-pink-500/20 group-hover:bg-pink-500/30 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <div className="font-medium">Sign Up</div>
                  <div className="text-xs text-slate-500">Create new account</div>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/10 hover:border-white/20"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          {session.user?.name ? (
            <span className="text-white font-semibold text-sm">
              {session.user.name.charAt(0).toUpperCase()}
            </span>
          ) : (
            <UserCircle className="w-5 h-5 text-white" />
          )}
        </div>
        <span className="text-slate-300 text-sm hidden md:block max-w-[120px] truncate">
          {session.user?.name || session.user?.email}
        </span>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                {session.user?.name ? (
                  <span className="text-white font-bold text-lg">
                    {session.user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <UserCircle className="w-7 h-7 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                {session.user?.name && (
                  <div className="text-white font-medium truncate">{session.user.name}</div>
                )}
                <div className="text-slate-400 text-sm truncate">{session.user?.email}</div>
              </div>
            </div>
          </div>
          <div className="p-2">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-white/5 hover:text-white rounded-lg transition-all group"
              onClick={() => setShowMenu(false)}
            >
              <User className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
              <span className="font-medium">My Profile</span>
            </Link>
            <button
              onClick={() => {
                setShowMenu(false)
                signOut({ callbackUrl: '/' })
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all group"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

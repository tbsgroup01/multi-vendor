import React from 'react'
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
       {/* Header */}
      <header className="relative sticky  top-0 z-99999 flex h-[76px] items-center justify-between border-b border-slate-100 bg-white/90 px-5 sm:px-8 lg:px-14">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-bold text-white shadow-lg shadow-blue-200/60">
            M
          </span>

          <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Market<span className="text-blue-600">Place</span>
          </span>
        </Link>

        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" className="h-5 w-5">
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5.5 9v12h13V9M9.5 21v-7h5v7" />
          </svg>
          <span className="hidden sm:inline">← Back to Home</span>
        </Link>
      </header>
    </>
  )
}

export default Navbar


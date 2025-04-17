import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HomeIcon, PlusIcon, CurrencyDollarIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'

const Navbar = () => {
  const [user, setUser] = useState<any>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Airdropedia
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="nav-link inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500"
              >
                <HomeIcon className="h-5 w-5 mr-2" />
                Home
              </Link>
              <Link
                to="/add"
                className="nav-link inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Project
              </Link>
              <Link
                to="/donate"
                className="nav-link inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500"
              >
                <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                Donate
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="hidden sm:inline text-black">
                  Welcome {user.email.split('@')[0]}
                </span>
                <button
                  onClick={handleSignOut}
                  className="btn-secondary text-sm sm:text-base px-3 sm:px-6"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="btn-primary text-sm sm:text-base px-3 sm:px-6"
              >
                <UserIcon className="h-5 w-5 mr-2 inline" />
                Get Started
              </Link>
            )}
            <button
              onClick={toggleMobileMenu}
              className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-md">
          <Link
            to="/"
            className="nav-link block px-3 py-2 text-base font-medium hover:bg-gray-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <HomeIcon className="h-5 w-5 mr-2 inline" />
            Home
          </Link>
          <Link
            to="/add"
            className="nav-link block px-3 py-2 text-base font-medium hover:bg-gray-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <PlusIcon className="h-5 w-5 mr-2 inline" />
            Add Project
          </Link>
          <Link
            to="/donate"
            className="nav-link block px-3 py-2 text-base font-medium hover:bg-gray-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <CurrencyDollarIcon className="h-5 w-5 mr-2 inline" />
            Donate
          </Link>
          {user && (
            <div className="px-3 py-2 text-sm text-gray-700">
              Signed in as: {user.email.split('@')[0]}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar 
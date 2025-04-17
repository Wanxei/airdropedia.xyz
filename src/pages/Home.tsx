import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { MagnifyingGlassIcon, FunnelIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { useLocation, useNavigate } from 'react-router-dom'

interface Airdrop {
  id: number
  project_name: string
  blockchain: string
  ticker: string
  cost: string
  funding: string
  steps: string
  media_url: string
  referral_link: string
  created_at: string
  user_id?: string
  canEdit: boolean
}

const Home = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [airdrops, setAirdrops] = useState<Airdrop[]>([])
  const [filteredAirdrops, setFilteredAirdrops] = useState<Airdrop[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedBlockchain, setSelectedBlockchain] = useState('')
  const [selectedCost, setSelectedCost] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [activeMenu, setActiveMenu] = useState<number | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const blockchainOptions = [
    'All Blockchains',
    'Ethereum',
    'Solana',
    'BNB Chain',
    'Polygon',
    'Arbitrum',
    'Optimism',
    'Avalanche',
    'Base',
    'Other'
  ]

  const costOptions = [
    'All Costs',
    'Free',
    'Paid'
  ]

  // Get current user
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fetch airdrops with user_id
  const fetchAirdrops = async () => {
    const { data, error } = await supabase
      .from('airdrops')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching airdrops:', error)
    } else {
      // Get current user's ID for comparison
      const { data: { session } } = await supabase.auth.getSession()
      const airdropsWithEditPermission = data?.map(airdrop => ({
        ...airdrop,
        canEdit: session?.user?.id === airdrop.user_id
      })) || []
      
      setAirdrops(airdropsWithEditPermission)
      setFilteredAirdrops(airdropsWithEditPermission)
    }
    setLoading(false)
  }

  // Handle delete airdrop
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this airdrop?')
    if (!confirmed) return

    const { error } = await supabase
      .from('airdrops')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting airdrop:', error)
    } else {
      // Refresh the airdrops list
      fetchAirdrops()
      setActiveMenu(null)
    }
  }

  // Handle edit airdrop
  const handleEdit = (airdrop: Airdrop) => {
    navigate(`/edit/${airdrop.id}`, { 
      state: { 
        airdrop: {
          ...airdrop,
          blockchain: airdrop.blockchain || 'Select Blockchain',
          cost: airdrop.cost || 'Select Cost'
        }
      } 
    })
    setActiveMenu(null)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMenu && !(event.target as Element).closest('.kebab-menu')) {
        setActiveMenu(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [activeMenu])

  useEffect(() => {
    fetchAirdrops()
  }, [])

  useEffect(() => {
    const state = location.state as { newAirdrop?: Airdrop; updatedAirdrop?: Airdrop }
    if (state?.newAirdrop || state?.updatedAirdrop) {
      setShowSuccess(true)
      fetchAirdrops() // Refresh the list
      window.history.replaceState({}, document.title)
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }
  }, [location])

  useEffect(() => {
    let result = [...airdrops]

    if (searchTerm) {
      result = result.filter(airdrop =>
        airdrop.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airdrop.ticker.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedBlockchain && selectedBlockchain !== 'All Blockchains') {
      result = result.filter(airdrop => airdrop.blockchain === selectedBlockchain)
    }

    if (selectedCost && selectedCost !== 'All Costs') {
      result = result.filter(airdrop => airdrop.cost === selectedCost)
    }

    setFilteredAirdrops(result)
  }, [searchTerm, selectedBlockchain, selectedCost, airdrops])

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedBlockchain('')
    setSelectedCost('')
    setShowFilters(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">
              {location.state?.updatedAirdrop ? 'Airdrop updated successfully!' : 'Airdrop added successfully!'}
            </span>
          </div>
        </div>
      )}

      <div className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-blue-600">
          Discover Crypto Airdrops
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
          Find and participate in the latest crypto airdrops from the most promising projects
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by project name or ticker..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm text-gray-800 placeholder-gray-400"
          />
        </div>
        <div className="flex gap-2 sm:gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
              showFilters 
                ? 'bg-blue-500 text-white'
                : 'bg-white/50 backdrop-blur-sm hover:bg-white/80 text-gray-700'
            }`}
          >
            <FunnelIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Filters</span>
          </button>
          {(searchTerm || selectedBlockchain || selectedCost) && (
            <button
              onClick={resetFilters}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-xl font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200 shadow-sm"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blockchain</label>
              <select
                value={selectedBlockchain}
                onChange={(e) => setSelectedBlockchain(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
              >
                {blockchainOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost</label>
              <select
                value={selectedCost}
                onChange={(e) => setSelectedCost(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
              >
                {costOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        <span className="inline-block px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
          Found {filteredAirdrops.length} airdrop{filteredAirdrops.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAirdrops.map((airdrop) => (
          <div key={airdrop.id} className="bg-white rounded-3xl p-6 shadow-md relative">
            {airdrop.canEdit && (
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(activeMenu === airdrop.id ? null : airdrop.id);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
                </button>
                {activeMenu === airdrop.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 border border-gray-100">
                    <div className="py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(airdrop);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(airdrop.id);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {airdrop.media_url && (
              <div className="mb-4 -mx-6 -mt-6">
                <img
                  src={airdrop.media_url}
                  alt={`${airdrop.project_name} media`}
                  className="w-full h-48 object-cover rounded-t-3xl"
                />
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {airdrop.project_name}
            </h2>

            <div className="inline-block mb-6">
              <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                {airdrop.blockchain}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Ticker:</span>
                <span className="font-bold text-gray-900">${airdrop.ticker}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cost:</span>
                <span className="font-bold text-gray-900">{airdrop.cost}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Funding:</span>
                <div className="text-gray-900">{airdrop.funding}</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Steps to Participate:</h3>
              <ol className="list-decimal list-inside space-y-1 text-gray-600">
                {airdrop.steps.split('\n').map((step, index) => (
                  <li key={index} className="pl-1">{step}</li>
                ))}
              </ol>
            </div>

            <a
              href={airdrop.referral_link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-6 py-3 text-center font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200"
            >
              Participate Now
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home 
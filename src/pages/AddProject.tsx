import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

const AddProject = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    project_name: '',
    blockchain: 'Select Blockchain',
    ticker: '',
    cost: 'Select Cost',
    funding: '',
    steps: '',
    media_url: '',
    referral_link: ''
  })
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string>('')
  const [error, setError] = useState<string>('')

  const blockchainOptions = [
    'Select Blockchain',
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
    'Select Cost',
    'Free',
    'Paid'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Get current user
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setError('You must be logged in to add an airdrop')
      return
    }

    if (formData.blockchain === 'Select Blockchain') {
      setError('Please select a blockchain')
      return
    }

    if (formData.cost === 'Select Cost') {
      setError('Please select a cost option')
      return
    }

    setLoading(true)

    try {
      // Check for duplicate ticker
      const { data: existingTickerData } = await supabase
        .from('airdrops')
        .select('id, project_name')
        .ilike('ticker', formData.ticker.trim())
        .single()

      if (existingTickerData) {
        setError('Project already exists')
        setLoading(false)
        return
      }

      // Check for duplicate referral link
      const { data: existingLinkData } = await supabase
        .from('airdrops')
        .select('id, project_name')
        .ilike('referral_link', formData.referral_link.trim())
        .single()

      if (existingLinkData) {
        setError('Project already exists')
        setLoading(false)
        return
      }

      let media_url = formData.media_url

      if (mediaFile) {
        const fileExt = mediaFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError, data } = await supabase.storage
          .from('airdrop-media')
          .upload(filePath, mediaFile)

        if (uploadError) throw uploadError

        if (data) {
          const { data: { publicUrl } } = supabase.storage
            .from('airdrop-media')
            .getPublicUrl(filePath)
          
          media_url = publicUrl
        }
      }

      // Create the airdrop data object
      const airdropData = {
        project_name: formData.project_name.trim(),
        blockchain: formData.blockchain === 'Select Blockchain' ? '' : formData.blockchain,
        ticker: formData.ticker.trim(),
        cost: formData.cost === 'Select Cost' ? '' : formData.cost,
        funding: formData.funding.trim(),
        steps: formData.steps.trim(),
        media_url: media_url.trim(),
        referral_link: formData.referral_link.trim(),
        created_at: new Date().toISOString(),
        user_id: session.user.id
      }

      const { error, data } = await supabase
        .from('airdrops')
        .insert([airdropData])
        .select()

      if (error) throw error

      setShowSuccess(true)
      // Reset form
      setFormData({
        project_name: '',
        blockchain: 'Select Blockchain',
        ticker: '',
        cost: 'Select Cost',
        funding: '',
        steps: '',
        media_url: '',
        referral_link: ''
      })
      setMediaFile(null)
      setMediaPreview('')
      
      // Wait for success message to be visible
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Navigate back with the new airdrop data
      navigate('/', { state: { newAirdrop: data?.[0] } })
    } catch (error: any) {
      console.error('Error adding project:', error)
      setError(error.message || 'Failed to add airdrop')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMediaFile(file)
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setMediaPreview(previewUrl)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Airdrop added successfully!</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-black">
          Add New Airdrop
        </h1>
        <p className="mt-4 text-lg text-black">
          Share a new airdrop opportunity with the community
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="project_name" className="block text-sm font-medium text-black mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  id="project_name"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleChange}
                  required
                  className="input-field text-black"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label htmlFor="blockchain" className="block text-sm font-medium text-black mb-2">
                  Blockchain
                </label>
                <select
                  id="blockchain"
                  name="blockchain"
                  value={formData.blockchain}
                  onChange={handleChange}
                  required
                  className="input-field text-black"
                >
                  {blockchainOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="ticker" className="block text-sm font-medium text-black mb-2">
                  Ticker
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    $
                  </span>
                  <input
                    type="text"
                    id="ticker"
                    name="ticker"
                    value={formData.ticker}
                    onChange={handleChange}
                    required
                    className="input-field text-black pl-8"
                    placeholder="Enter ticker"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cost" className="block text-sm font-medium text-black mb-2">
                  Cost to Participate
                </label>
                <select
                  id="cost"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  required
                  className="input-field text-black"
                >
                  {costOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="funding" className="block text-sm font-medium text-black mb-2">
                  Funding Round
                </label>
                <input
                  type="text"
                  id="funding"
                  name="funding"
                  value={formData.funding}
                  onChange={handleChange}
                  className="input-field text-black"
                  placeholder="e.g., Seed, Series A"
                />
              </div>

              <div>
                <label htmlFor="media" className="block text-sm font-medium text-black mb-2">
                  Media
                </label>
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center w-full">
                    <label
                      htmlFor="media"
                      className="relative w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <input
                        type="file"
                        id="media"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {mediaPreview && (
                    <div className="mt-4">
                      <div className="relative group">
                        <img
                          src={mediaPreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setMediaFile(null);
                            setMediaPreview('');
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="referral_link" className="block text-sm font-medium text-black mb-2">
                  Referral Link
                </label>
                <input
                  type="url"
                  id="referral_link"
                  name="referral_link"
                  value={formData.referral_link}
                  onChange={handleChange}
                  required
                  className="input-field text-black"
                  placeholder="Enter airdrop participation link"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="steps" className="block text-sm font-medium text-black mb-2">
              Steps to Participate
            </label>
            <textarea
              id="steps"
              name="steps"
              value={formData.steps}
              onChange={handleChange}
              required
              rows={6}
              className="input-field text-black"
              placeholder="Describe the steps to participate in the airdrop..."
            />
          </div>

          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </div>
              ) : (
                'Submit Airdrop'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProject 
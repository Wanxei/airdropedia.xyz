import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

const Donate = () => {
  const walletAddress = 'BFC72GhXR2WGKj7MxMN17WuyCDFnHtgLufTgZeHhqsML'

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress)
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Support Airdropedia
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Your donation helps us maintain and improve the platform for the crypto community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Solana Donation */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Donate with Solana</h3>
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <QRCodeSVG 
                  value={walletAddress} 
                  size={200} 
                  className="p-4 bg-white rounded-lg shadow-sm"
                />
                <div className="mt-4 w-full">
                  <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                    <code className="text-sm font-mono text-gray-700 break-all">
                      {walletAddress}
                    </code>
                    <button
                      onClick={copyToClipboard}
                      className="btn-secondary whitespace-nowrap"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Donate */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Donate?</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">Help maintain server costs and infrastructure</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">Support ongoing development and new features</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">Keep the platform free and accessible for everyone</span>
                </li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Other Ways to Support</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">Share with Friends</h4>
                    <p className="text-gray-600">Help grow our community by sharing Airdropedia</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">Contribute Code</h4>
                    <p className="text-gray-600">Help improve the platform through GitHub</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Donate 
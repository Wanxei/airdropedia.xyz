import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const AuthPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Welcome to Airdropedia
          </h2>
          <p className="mt-4 text-gray-600">
            Sign in or create an account to start adding airdrops
          </p>
        </div>
        <div className="card">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#3B82F6',
                    brandAccent: '#2563EB',
                  },
                },
              },
              style: {
                button: {
                  color: 'white',
                },
                anchor: {
                  color: '#000000',
                },
              },
              className: {
                container: 'space-y-4',
                button: 'btn-primary w-full',
                input: 'input-field',
                label: 'text-gray-700 font-medium',
                message: 'text-red-500 text-sm',
                anchor: 'text-black hover:text-blue-600 transition-colors duration-200',
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  social_provider_text: "Continue with {{provider}}"
                },
                sign_up: {
                  social_provider_text: "Continue with {{provider}}"
                }
              }
            }}
            providers={['google']}
            redirectTo="https://airdropedia.vercel.app"
          />
        </div>
      </div>
    </div>
  )
}

export default AuthPage 
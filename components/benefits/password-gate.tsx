'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'

interface PasswordGateProps {
  correctPassword: string
  onSuccess: () => void
}

export function PasswordGate({ correctPassword, onSuccess }: PasswordGateProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate a brief delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (password === correctPassword) {
      onSuccess()
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="type-h2 text-foreground mb-2">Members Only</h1>
          <p className="type-lead">
            Enter the shared password to access exclusive member benefits and partner discounts.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter member password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-12 h-12 text-base"
              autoFocus
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full h-12"
            disabled={!password || isLoading}
          >
            {isLoading ? 'Verifying...' : 'Access Benefits'}
          </Button>
        </form>

        <p className="text-center text-muted-foreground text-sm mt-6">
          Don&apos;t have the password? Contact your run captain.
        </p>
      </div>
    </div>
  )
}

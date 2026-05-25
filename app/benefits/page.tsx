'use client'

import { useState } from 'react'
import { PasswordGate } from '@/components/benefits/password-gate'
import { BenefitsDashboard } from '@/components/benefits/benefits-dashboard'

// Shared password for MVP - in production, use proper auth
const MEMBER_PASSWORD = 'ayoprun2024'

export default function BenefitsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (!isAuthenticated) {
    return (
      <PasswordGate
        correctPassword={MEMBER_PASSWORD}
        onSuccess={() => setIsAuthenticated(true)}
      />
    )
  }

  return <BenefitsDashboard />
}

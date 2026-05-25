'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Check, ExternalLink, Clock, AlertTriangle } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import type { Benefit } from './benefits-dashboard'

interface BenefitCardProps {
  benefit: Benefit
  isExpired?: boolean
}

export function BenefitCard({ benefit, isExpired = false }: BenefitCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(benefit.discountCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = benefit.discountCode
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getExpirationInfo = () => {
    if (!benefit.expiresAt) {
      return { text: 'No expiration', variant: 'secondary' as const, urgent: false }
    }

    const expirationDate = new Date(benefit.expiresAt)
    const today = new Date()
    const daysUntilExpiration = differenceInDays(expirationDate, today)

    if (daysUntilExpiration < 0) {
      return {
        text: `Expired ${format(expirationDate, 'MMM d, yyyy')}`,
        variant: 'destructive' as const,
        urgent: false,
      }
    }

    if (daysUntilExpiration <= 7) {
      return {
        text: `Expires in ${daysUntilExpiration} day${daysUntilExpiration === 1 ? '' : 's'}`,
        variant: 'destructive' as const,
        urgent: true,
      }
    }

    if (daysUntilExpiration <= 30) {
      return {
        text: `Expires ${format(expirationDate, 'MMM d')}`,
        variant: 'outline' as const,
        urgent: false,
      }
    }

    return {
      text: `Valid until ${format(expirationDate, 'MMM d, yyyy')}`,
      variant: 'secondary' as const,
      urgent: false,
    }
  }

  const expirationInfo = getExpirationInfo()

  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${isExpired ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-bold text-foreground truncate">
              {benefit.brand}
            </CardTitle>
            <CardDescription className="mt-1 line-clamp-2">
              {benefit.description}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {benefit.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Discount Value */}
        <div className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary/10 text-primary font-semibold text-sm">
          {benefit.discountValue}
        </div>

        {/* Code Display and Copy */}
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-muted rounded-md px-4 py-3 font-mono text-sm text-foreground tracking-wider">
            {benefit.discountCode}
          </div>
          <Button
            variant={copied ? 'default' : 'outline'}
            size="icon"
            onClick={handleCopy}
            disabled={isExpired}
            className="shrink-0 transition-all"
            aria-label={copied ? 'Code copied' : 'Copy discount code'}
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Copy Feedback */}
        {copied && (
          <p className="text-sm text-primary font-medium flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            Code copied to clipboard!
          </p>
        )}

        {/* Expiration Info */}
        <div className="flex items-center gap-2 text-sm">
          {expirationInfo.urgent ? (
            <AlertTriangle className="w-4 h-4 text-destructive" />
          ) : (
            <Clock className="w-4 h-4 text-muted-foreground" />
          )}
          <span className={expirationInfo.urgent ? 'text-destructive font-medium' : 'text-muted-foreground'}>
            {expirationInfo.text}
          </span>
        </div>

        {/* Shop CTA */}
        <Button
          variant={isExpired ? 'outline' : 'default'}
          className="w-full gap-2"
          asChild
          disabled={isExpired}
        >
          <a
            href={benefit.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={isExpired ? 'pointer-events-none' : ''}
          >
            {isExpired ? 'Offer Expired' : 'Shop Now'}
            {!isExpired && <ExternalLink className="w-4 h-4" />}
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}

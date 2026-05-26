'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Copy, Check, ExternalLink, Clock, AlertTriangle, Download, MapPin, MessageCircle, Globe, Store } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import type { BenefitDto } from '@/lib/benefits/types'
import { BENEFIT_REDEMPTION_LABEL } from '@/lib/benefits/constants'
import { getCategoryIcon } from '@/lib/benefits/categoryIcon'

interface BenefitCardProps {
  benefit: BenefitDto
  isExpired?: boolean
}

export function BenefitCard({ benefit, isExpired = false }: BenefitCardProps) {
  const [copied, setCopied] = useState(false)

  const voucherFileName = `ayop-${benefit.brand.toLowerCase().replace(/\s+/g, '-')}-voucher.jpg`

  const handleShareWhatsApp = async () => {
    if (!benefit.qrImageUrl) return
    const shareText = `${benefit.brand} — ${benefit.discountValue} for AYOP members.`

    try {
      const res = await fetch(benefit.qrImageUrl)
      const blob = await res.blob()
      const file = new File([blob], voucherFileName, {
        type: blob.type || 'image/jpeg',
      })
      if (
        typeof navigator !== 'undefined' &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: benefit.brand,
          text: shareText,
        })
        return
      }
    } catch {
      // Web Share with files not supported / user dismissed — fall through.
    }

    const fullUrl =
      typeof window !== 'undefined'
        ? new URL(benefit.qrImageUrl, window.location.origin).toString()
        : benefit.qrImageUrl
    const message = encodeURIComponent(`${shareText}\n${fullUrl}`)
    window.open(`https://wa.me/?text=${message}`, '_blank', 'noopener,noreferrer')
  }

  const handleCopy = async () => {
    if (!benefit.discountCode) return
    try {
      await navigator.clipboard.writeText(benefit.discountCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = benefit.discountCode ?? ''
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
  const CategoryIcon = getCategoryIcon(benefit.category)

  return (
    <Card
      className={`relative flex h-full flex-col overflow-hidden rounded-none border-border shadow-none transition-colors hover:border-foreground/40 ${
        isExpired ? 'opacity-75' : ''
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <CardTitle className="line-clamp-1 text-lg font-bold text-foreground">
              {benefit.brand}
            </CardTitle>
            {benefit.description && (
              <CardDescription className="mt-1 line-clamp-2">
                {benefit.description}
              </CardDescription>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
            <Badge
              variant="outline"
              className="gap-1"
              aria-label={`Category: ${benefit.category}`}
            >
              <CategoryIcon className="h-3 w-3" aria-hidden />
              {benefit.category}
            </Badge>
            <Badge
              variant="outline"
              className="gap-1"
              aria-label={`Redemption: ${BENEFIT_REDEMPTION_LABEL[benefit.redemption]}`}
            >
              {benefit.redemption === 'online' ? (
                <Globe className="h-3 w-3" aria-hidden />
              ) : benefit.redemption === 'in_store' ? (
                <Store className="h-3 w-3" aria-hidden />
              ) : (
                <>
                  <Globe className="h-3 w-3" aria-hidden />
                  <Store className="h-3 w-3" aria-hidden />
                </>
              )}
              {BENEFIT_REDEMPTION_LABEL[benefit.redemption]}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        {/* Discount Value */}
        <div className="inline-flex w-fit items-center bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
          {benefit.discountValue}
        </div>

        {/* QR voucher OR copy-code row */}
        {benefit.qrImageUrl ? (
          <div className="flex items-center gap-4">
            <a
              href={benefit.qrImageUrl}
              download={voucherFileName}
              className="relative block h-24 w-24 shrink-0 overflow-hidden border border-border bg-background"
              aria-label={`Download ${benefit.brand} voucher`}
            >
              <Image
                src={benefit.qrImageUrl}
                alt={`${benefit.brand} member voucher`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </a>
            <div className="flex-1 space-y-2">
              <Button
                variant="outline"
                className="w-full gap-2 rounded-none"
                asChild
                disabled={isExpired}
              >
                <a
                  href={benefit.qrImageUrl}
                  download={voucherFileName}
                  className={isExpired ? 'pointer-events-none' : ''}
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 rounded-none"
                onClick={handleShareWhatsApp}
                disabled={isExpired}
              >
                <MessageCircle className="h-4 w-4" />
                Send to WhatsApp
              </Button>
            </div>
          </div>
        ) : benefit.discountCode ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted px-4 py-3 font-mono text-sm tracking-wider text-foreground">
              {benefit.discountCode}
            </div>
            <Tooltip open={copied}>
              <TooltipTrigger asChild>
                <Button
                  variant={copied ? 'default' : 'outline'}
                  size="icon"
                  onClick={handleCopy}
                  disabled={isExpired}
                  className="shrink-0 rounded-none transition-all"
                  aria-label={copied ? 'Code copied' : 'Copy discount code'}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6}>
                Code copied!
              </TooltipContent>
            </Tooltip>
          </div>
        ) : null}

        {/* Spacer + Meta + Shop CTA pinned to the bottom */}
        <div className="mt-auto space-y-3 pt-2">
          <div className="space-y-1.5 text-sm">
            {benefit.locations && benefit.locations.length > 0 && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>
                  <span className="text-foreground">Valid at</span>{' '}
                  {benefit.locations.join(' & ')}{' '}
                  <span className="text-muted-foreground">only</span>
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              {expirationInfo.urgent ? (
                <AlertTriangle
                  className="h-4 w-4 shrink-0 text-destructive"
                  aria-hidden
                />
              ) : (
                <Clock
                  className="h-4 w-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
              )}
              <span
                className={
                  expirationInfo.urgent
                    ? 'font-medium text-destructive'
                    : 'text-muted-foreground'
                }
              >
                {expirationInfo.text}
              </span>
            </div>
          </div>

          <Button
            variant={isExpired ? 'outline' : 'default'}
            className="w-full gap-2 rounded-none"
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
              {!isExpired && <ExternalLink className="h-4 w-4" />}
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

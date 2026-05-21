import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  isPathAllowedInPhotosOnlyMode,
  isPhotosOnlyProduction,
} from '@/lib/site-mode'

export function middleware(request: NextRequest) {
  if (!isPhotosOnlyProduction()) {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/photos', request.url))
  }

  if (!isPathAllowedInPhotosOnlyMode(pathname)) {
    return NextResponse.redirect(new URL('/photos', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}

import Link from 'next/link'
import { SiteLogo } from '@/components/site-logo'
import { socialLinks } from '@/lib/data'
import { getHomeHref, getPublicNavLinks, shouldShowPublicNav } from '@/lib/site-mode'
import { cn } from '@/lib/utils'

export function Footer() {
  const homeHref = getHomeHref()
  const navLinks = getPublicNavLinks()
  const showSiteNav = shouldShowPublicNav()

  return (
    <footer className="border-t border-border bg-card">
      <div className="px-6 md:px-12 py-12 md:py-16">
        <div
          className={cn(
            'grid gap-8 md:gap-12',
            showSiteNav
              ? 'grid-cols-2 md:grid-cols-4'
              : 'grid-cols-1 md:grid-cols-2',
          )}
        >
          {/* Brand */}
          <div className={cn(showSiteNav && 'col-span-2 md:col-span-1')}>
            <Link href={homeHref} aria-label="AYOP home">
              <SiteLogo className="h-4" />
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              At Your Own Pace.
              <br />
              Berlin Running Community.
            </p>
          </div>

          {showSiteNav && (
            <>
              <div>
                <h3 className="text-sm font-medium text-foreground mb-4">
                  Navigate
                </h3>
                <ul className="space-y-2">
                  {navLinks.slice(0, 4).map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* <div>
                <h3 className="text-sm font-medium text-foreground mb-4">
                  More
                </h3>
                <ul className="space-y-2">
                  {navLinks.slice(4).map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div> */}
            </>
          )}

          {/* Connect */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-4">
              Connect
            </h3>
            <ul className="space-y-2">
              {socialLinks.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {social.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <p className="text-xs text-muted-foreground">
            Berlin, Germany
          </p>
          <p className="text-xs text-muted-foreground">
            At Your Own Pace. Always.
          </p>
        </div>
      </div>
    </footer>
  )
}

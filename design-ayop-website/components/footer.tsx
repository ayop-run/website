import Link from 'next/link'
import { navLinks, socialLinks } from '@/lib/data'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold tracking-tight">
              AYOP
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              At Your Own Pace.
              <br />
              Berlin Running Community.
            </p>
          </div>

          {/* Navigation */}
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

          {/* More */}
          <div>
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
          </div>

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

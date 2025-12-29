import { MenuIcon } from 'lucide-react'
import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import BookingForm from '~/components/booking-form'
import AppChatBot from '~/components/chatbot'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '~/components/ui/sheet'
import { bookingData } from '~/lib/data'
import { cn } from '~/lib/utils'

export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <header className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        {
          'bg-black/50 text-white': isHome,
          'border-b border-border bg-background/80 text-foreground backdrop-blur-md': !isHome,
        },
      )}
      >
        <div className={`
          container mx-auto flex h-20 items-center justify-between px-4
        `}
        >
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo_3.png"
              alt="Dampa Tiger Reserve"
              className="size-12 object-contain"
            />
            <span className={cn(
              'text-xl font-bold tracking-tight',
              { 'text-white': isHome, 'text-primary': !isHome },
            )}
            >
              DAMPA TIGER RESERVE
            </span>
          </Link>

          <nav className={`
            hidden items-center gap-8 text-sm font-medium
            md:flex
          `}
          >
            <NavLink to="/" isHome={isHome}>HOME</NavLink>
            <NavLink to="/about-us" isHome={isHome}>ABOUT US</NavLink>
            <NavLink to="/gallery" isHome={isHome}>GALLERY</NavLink>
            <Link
              to="/booking"
              className={cn(
                'rounded-full px-4 py-2 transition-colors',
                {
                  'bg-white text-black hover:bg-white/90': isHome,
                  'bg-primary text-primary-foreground hover:bg-primary/90': !isHome,
                },
              )}
            >
              BOOK NOW
            </Link>
          </nav>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger className={`
              flex items-center justify-center rounded-md p-2
              md:hidden
            `}
            >
              <MenuIcon className={cn('size-6', isHome
                ? 'text-white'
                : `text-foreground`)}
              />
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4">
                <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>HOME</MobileNavLink>
                <MobileNavLink to="/about-us" onClick={() => setIsMobileMenuOpen(false)}>ABOUT US</MobileNavLink>
                <MobileNavLink to="/gallery" onClick={() => setIsMobileMenuOpen(false)}>GALLERY</MobileNavLink>
                <MobileNavLink to="/booking" onClick={() => setIsMobileMenuOpen(false)}>BOOKING</MobileNavLink>
                <MobileNavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>LOGIN</MobileNavLink>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className={`
        fixed right-6 bottom-6 z-40
        md:hidden
      `}
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button className={`
              flex items-center gap-2 rounded-full px-6 py-3 font-bold shadow-lg
              transition-all
              hover:scale-105
            `}
            >

              Book Now
            </Button>
          </DialogTrigger>
          <DialogContent className={`
            max-h-[90vh] overflow-y-auto
            sm:max-w-2xl
          `}
          >
            <BookingForm />
          </DialogContent>
        </Dialog>
      </div>

      <main className="flex-1">
        <Outlet />
      </main>

      {!isHome && (
        <footer className="bg-muted py-12 text-muted-foreground">
          <div className={`
            container mx-auto grid grid-cols-1 gap-8 px-4
            md:grid-cols-3
          `}
          >
            <div>
              <h3 className="mb-4 text-lg font-bold text-foreground">Dampa Tiger Reserve</h3>
              <p className="text-sm leading-relaxed">
                Experience the untamed wilderness of Mizoram. Home to diverse flora and fauna, offering a unique escape into nature.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold text-foreground">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-primary">Home</Link></li>
                <li><Link to="/about-us" className="hover:text-primary">About Us</Link></li>
                <li><Link to="/gallery" className="hover:text-primary">Gallery</Link></li>
                <li><Link to="/booking" className="hover:text-primary">Booking Info</Link></li>
                <li><Link to="/login" className="hover:text-primary">Login</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold text-foreground">Contact</h3>
              <div className="space-y-2 text-sm">
                <p>
                  Ph:
                  {bookingData.contactInformation.contacts[0].phoneNumbers.join(', ')}
                </p>
                <p>
                  Location:
                  {bookingData.location.name}
                </p>
                <p>
                  Season:
                  {bookingData.location.openSeason.text}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center text-xs">
            ©
            {' '}
            {new Date().getFullYear()}
            {' '}
            Dampa Tiger Reserve. All rights reserved.
          </div>
        </footer>

      )}
      <AppChatBot />
    </div>
  )
}

function NavLink({ to, children, isHome }: { to: string, children: React.ReactNode, isHome: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        `
          hover:text-opacity-80
          transition-colors
        `,
        {
          'text-white': isHome,
          'text-foreground hover:text-primary': !isHome,
        },
      )}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ to, children, onClick }: { to: string, children: React.ReactNode, onClick?: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        rounded-lg px-4 py-3 text-lg font-medium text-foreground
        transition-colors
        hover:bg-muted
      `}
    >
      {children}
    </Link>
  )
}

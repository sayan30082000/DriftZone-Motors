import { useEffect, useState } from 'react'
import { Heart } from './Icons'
import { scrollToId } from '../lib/utils'

const LINKS = [
  ['home', 'Home'],
  ['showroom', 'Showroom'],
  ['services', 'Services'],
  ['emi', 'EMI'],
  ['booking', 'Test Drive'],
  ['contact', 'Contact'],
]

export function Logo() {
  return (
    <a href="#home" className="logo" aria-label="DriftZone Motors home">
      <span className="logo-mark">DZ</span>
      <span>DriftZone <b>Motors</b></span>
    </a>
  )
}

export default function Navbar({ wishCount, onShowWishlist }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // highlight the section currently in the middle of the screen
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    LINKS.forEach(([id]) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <header className={`nav${scrolled ? ' scrolled' : ''}`}>
      <Logo />
      <nav className={`nav-links${open ? ' open' : ''}`} onClick={() => setOpen(false)}>
        {LINKS.map(([id, label]) => (
          <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>{label}</a>
        ))}
      </nav>
      <div className="nav-actions">
        <button className="icon-btn" onClick={onShowWishlist} aria-label={`Show wishlist (${wishCount})`}>
          <Heart />
          {wishCount > 0 && <span className="count">{wishCount}</span>}
        </button>
        <button className="btn btn-sm btn-primary nav-cta" onClick={() => scrollToId('booking')}>Book Test Drive</button>
        <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}

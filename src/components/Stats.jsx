import { useEffect, useRef, useState } from 'react'
import { BRANDS, CARS } from '../data/cars'
import { prefersReducedMotion } from '../lib/utils'

function CountUp({ to, suffix = '' }) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    let raf
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        if (prefersReducedMotion()) return setValue(to)
        const t0 = performance.now()
        const step = now => {
          const k = Math.min((now - t0) / 1400, 1)
          setValue(Math.round(to * (1 - Math.pow(1 - k, 3))))
          if (k < 1) raf = requestAnimationFrame(step)
        }
        raf = requestAnimationFrame(step)
      },
      { threshold: 0.6 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [to])

  return <span className="stat-num" ref={ref}>{value.toLocaleString('en-IN')}{suffix}</span>
}

const STATS = [
  { to: CARS.length, suffix: '+', label: 'Models in stock' },
  { to: 1500, suffix: '+', label: 'Happy owners' },
  { to: 12, suffix: ' yrs', label: 'In business' },
  { to: 24, suffix: '/7', label: 'Roadside support' },
]

export function Stats() {
  return (
    <section className="stats" aria-label="Shop highlights">
      <div className="container">
        {STATS.map(s => (
          <div className="stat" key={s.label}>
            <CountUp to={s.to} suffix={s.suffix} />
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Brands() {
  return (
    <div className="brands" aria-label="Brands we sell">
      <div className="brands-track">
        {[...BRANDS, ...BRANDS].map((b, i) => <span key={i} aria-hidden={i >= BRANDS.length}>{b}</span>)}
      </div>
    </div>
  )
}

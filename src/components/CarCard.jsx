import { memo } from 'react'
import { Bolt, Compare, Fuel, Gauge, Gear, Heart, Seat } from './Icons'
import { formatBDT, formatKm } from '../lib/utils'

const badgeClass = b => (b === 'EV' ? ' ev' : b === 'Luxury' || b === 'Premium' ? ' lux' : '')

export function CarPhoto({ car, className = '', eager = false }) {
  return (
    <img
      className={`car-photo ${className}`.trim()}
      src={car.photo.src}
      alt={`${car.year} ${car.brand} ${car.model}`}
      width={car.photo.w}
      height={car.photo.h}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}

function CarCard({ car, index, wished, comparing, onWish, onCompare, onTestDrive }) {
  const c = car
  return (
    <article className="card" style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}>
      <div className="card-stage">
        <CarPhoto car={c} eager={index < 4} />
        {c.badge && <span className={`badge${badgeClass(c.badge)}`}>{c.badge}</span>}
        <button
          className={`wish${wished ? ' on' : ''}`}
          aria-pressed={wished}
          aria-label={`Save ${c.brand} ${c.model} to wishlist`}
          onClick={() => onWish(c)}
        >
          <Heart />
        </button>
      </div>

      <div className="card-body">
        <div className="card-title">
          <div>
            <small>{c.brand} · {c.year}</small>
            <h3>{c.model}</h3>
          </div>
          <span className={`tag ${c.cond === 'Brand new' ? 'new' : 'recon'}`}>{c.cond}</span>
        </div>

        <ul className="specs">
          <li>{c.fuel === 'Electric' ? <Bolt /> : <Fuel />}<span>{c.fuel}</span></li>
          <li><Gear /><span>{c.trans}</span></li>
          <li><Gauge /><span>{formatKm(c.km)}</span></li>
          <li><Seat /><span>{c.seats} seats</span></li>
        </ul>

        <div className="swatches" aria-label={`Available in ${c.colors.length} colours`}>
          <small>Colours</small>
          {c.colors.map(h => <span key={h} className="swatch" style={{ '--s': h }} />)}
        </div>

        <div className="card-foot">
          <div className="price">
            <small>Price</small>
            <strong>{formatBDT(c.price)}</strong>
          </div>
          <div className="card-actions">
            <button
              className={`cmp-btn${comparing ? ' on' : ''}`}
              title="Add to compare"
              aria-pressed={comparing}
              aria-label={`Compare ${c.model}`}
              onClick={() => onCompare(c.id)}
            >
              <Compare />
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => onTestDrive(c.id)}>Test drive</button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default memo(CarCard)

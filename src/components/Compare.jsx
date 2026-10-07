import { useEffect, useRef } from 'react'
import { CarPhoto } from './CarCard'
import { byId } from '../data/cars'
import { emiFor, formatBDT, formatKm } from '../lib/utils'

const ROWS = [
  ['Price', c => formatBDT(c.price), (c, all) => c.price === Math.min(...all.map(x => x.price))],
  ['Year', c => c.year, (c, all) => c.year === Math.max(...all.map(x => x.year))],
  ['Type', c => c.type],
  ['Condition', c => c.cond],
  ['Fuel', c => c.fuel],
  ['Transmission', c => c.trans],
  ['Engine / Range', c => c.engine],
  ['Mileage', c => formatKm(c.km), (c, all) => c.km === Math.min(...all.map(x => x.km))],
  ['Seats', c => c.seats],
  ['EMI from', c => formatBDT(emiFor(c.price * 0.7, 9.5, 60)) + '/mo'],
]

export function CompareBar({ ids, onRemove, onClear, onOpen }) {
  const show = ids.length > 0
  useEffect(() => {
    document.body.classList.toggle('cmp-open', show)
  }, [show])

  return (
    <div className={`cmp-bar${show ? ' show' : ''}`} aria-live="polite">
      <div className="cmp-items">
        {ids.map(id => {
          const c = byId(id)
          return (
            <span className="cmp-item" key={id}>
              <CarPhoto car={c} />
              {c.model}
              <button onClick={() => onRemove(id)} aria-label={`Remove ${c.model}`}>✕</button>
            </span>
          )
        })}
      </div>
      <button className="btn btn-ghost btn-sm" onClick={onClear}>Clear</button>
      <button className="btn btn-primary btn-sm" onClick={onOpen} disabled={ids.length < 2}>
        Compare ({ids.length})
      </button>
    </div>
  )
}

export function CompareModal({ open, ids, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  const cars = ids.map(byId)

  return (
    <dialog ref={ref} aria-labelledby="cmpTitle" onClose={onClose} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-head">
        <h3 id="cmpTitle">Compare cars</h3>
        <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
      </div>
      <div className="table-wrap">
        <table className="cmp-table">
          <thead>
            <tr>
              <th />
              {cars.map(c => (
                <th key={c.id}>
                  <CarPhoto car={c} />
                  <small className="muted">{c.brand}</small>
                  <h4>{c.model}</h4>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([label, get, best]) => (
              <tr key={label}>
                <th>{label}</th>
                {cars.map(c => (
                  <td key={c.id} className={best && cars.length > 1 && best(c, cars) ? 'best' : ''}>{get(c)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </dialog>
  )
}

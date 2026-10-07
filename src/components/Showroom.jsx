import { useMemo } from 'react'
import CarArt from './CarArt'
import CarCard from './CarCard'
import Reveal from './Reveal'
import { Grid, Heart, Search } from './Icons'
import { CARS, TYPES } from '../data/cars'

const SORTERS = {
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'year-desc': (a, b) => b.year - a.year || a.price - b.price,
}

export default function Showroom({ filters, setFilters, wish, compare, onWish, onCompare, onTestDrive }) {
  const { type, q, sort, wishOnly } = filters
  const set = patch => setFilters(f => ({ ...f, ...patch }))

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const out = CARS.filter(
      c =>
        (type === 'All' || c.type === type) &&
        (!wishOnly || wish.includes(c.id)) &&
        (!needle || `${c.brand} ${c.model} ${c.type} ${c.fuel} ${c.year} ${c.cond}`.toLowerCase().includes(needle))
    )
    return SORTERS[sort] ? [...out].sort(SORTERS[sort]) : out
  }, [type, q, sort, wishOnly, wish])

  const tiles = [{ name: 'All' }, ...TYPES]

  return (
    <section className="block" id="showroom">
      <div className="container">
        <Reveal className="sec-head">
          <div>
            <p className="eyebrow">Showroom</p>
            <h2>Shop by type</h2>
          </div>
          <p>Pick a body type, search a brand, sort by price. Save favourites with ♥ and add up to 3 cars to compare side by side.</p>
        </Reveal>

        <Reveal className="types" role="tablist" aria-label="Car types">
          {tiles.map(t => {
            const count = t.name === 'All' ? CARS.length : CARS.filter(c => c.type === t.name).length
            const on = type === t.name
            return (
              <button key={t.name} role="tab" aria-selected={on} className={`type-tile${on ? ' active' : ''}`} onClick={() => set({ type: t.name })}>
                {t.body ? <CarArt body={t.body} color={t.color} electric={t.electric} /> : <Grid className="all-icon" />}
                <span className="t-name">{t.name === 'All' ? 'All cars' : t.name}</span>
                <span className="t-count">{count} models</span>
              </button>
            )
          })}
        </Reveal>

        <Reveal className="toolbar">
          <label className="search">
            <Search />
            <input className="input" type="search" value={q} onChange={e => set({ q: e.target.value })} placeholder="Search Toyota, SUV, Hybrid…" aria-label="Search cars" />
          </label>
          <select className="input select" value={sort} onChange={e => set({ sort: e.target.value })} aria-label="Sort cars">
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="year-desc">Newest first</option>
          </select>
          <button className="chip-btn" aria-pressed={wishOnly} onClick={() => set({ wishOnly: !wishOnly })}>
            <Heart /> Wishlist only
          </button>
          <span className="result-count">{list.length} of {CARS.length} cars</span>
        </Reveal>

        {list.length ? (
          <div className="grid">
            {list.map((c, i) => (
              <CarCard
                key={c.id}
                car={c}
                index={i}
                wished={wish.includes(c.id)}
                comparing={compare.includes(c.id)}
                onWish={onWish}
                onCompare={onCompare}
                onTestDrive={onTestDrive}
              />
            ))}
          </div>
        ) : (
          <div className="empty">
            <p>{wishOnly && !wish.length ? 'Your wishlist is empty — tap ♥ on any car to save it.' : 'No cars match that search.'}</p>
            <button className="btn btn-ghost btn-sm" onClick={() => setFilters({ type: 'All', q: '', sort, wishOnly: false })}>Reset filters</button>
          </div>
        )}
      </div>
    </section>
  )
}

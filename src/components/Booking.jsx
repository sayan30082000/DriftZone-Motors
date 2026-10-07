import { useState } from 'react'
import Reveal from './Reveal'
import { CARS, SHOP, byId } from '../data/cars'
import { formatBDT, whatsappUrl } from '../lib/utils'

const SLOTS = ['10:00 AM – 12:00 PM', '12:00 PM – 2:00 PM', '3:00 PM – 5:00 PM', '6:00 PM – 8:00 PM']
const isoDate = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
const tomorrow = () => isoDate(new Date(Date.now() + 86400000))
const BD_PHONE = /^(?:\+?88)?01[3-9]\d{8}$/

export default function Booking({ carId, setCarId }) {
  const [form, setForm] = useState({ name: '', phone: '', date: tomorrow(), time: SLOTS[0], where: 'Showroom' })
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(null)

  const set = (key, value) => {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: false }))
  }

  const submit = e => {
    e.preventDefault()
    const phone = form.phone.replace(/[\s-]/g, '')
    const errs = { name: form.name.trim().length < 2, phone: !BD_PHONE.test(phone), date: !form.date }
    setErrors(errs)
    const firstBad = Object.keys(errs).find(k => errs[k])
    if (firstBad) {
      document.getElementById(`b-${firstBad}`)?.focus()
      return
    }
    const car = byId(carId)
    const when = new Date(form.date + 'T00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
    setDone({
      summary: `${form.name.trim()}, we'll call ${phone} to confirm your ${car.brand} ${car.model} test drive on ${when}, ${form.time}, ${form.where === 'Home' ? 'at your home' : 'at our showroom'}.`,
      wa: whatsappUrl(
        `Hi ${SHOP.name}! I'd like a test drive.\nName: ${form.name.trim()}\nPhone: ${phone}\nCar: ${car.brand} ${car.model} (${car.year})\nDate: ${when}, ${form.time}\nWhere: ${form.where}`
      ),
    })
  }

  const field = (key, label, input, err) => (
    <div className={`field${errors[key] ? ' err' : ''}`}>
      <label htmlFor={`b-${key}`}>{label}</label>
      {input}
      {err && <small className="err-msg">{err}</small>}
    </div>
  )

  return (
    <section className="block" id="booking">
      <div className="container booking">
        <Reveal className="panel">
          <p className="eyebrow">Test drive</p>
          <h2>Book your seat</h2>

          {done ? (
            <div className="success">
              <div className="tick">✓</div>
              <h3>Request received!</h3>
              <p>{done.summary}</p>
              <a className="btn btn-primary" href={done.wa} target="_blank" rel="noopener noreferrer">Send on WhatsApp</a>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setDone(null)
                  setForm({ name: '', phone: '', date: tomorrow(), time: SLOTS[0], where: 'Showroom' })
                }}
              >
                Book another
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="form-grid">
                {field('name', 'Your name',
                  <input id="b-name" className="input" autoComplete="name" value={form.name} onChange={e => set('name', e.target.value)} />,
                  'Please enter your name')}
                {field('phone', 'Mobile number',
                  <input id="b-phone" className="input" type="tel" inputMode="tel" placeholder="01XXXXXXXXX" autoComplete="tel" value={form.phone} onChange={e => set('phone', e.target.value)} />,
                  'Enter a valid BD number (01XXXXXXXXX)')}
                <div className="field full">
                  <label htmlFor="b-car">Car</label>
                  <select id="b-car" className="input select" value={carId} onChange={e => setCarId(Number(e.target.value))}>
                    {CARS.map(c => <option key={c.id} value={c.id}>{c.brand} {c.model} — {formatBDT(c.price)}</option>)}
                  </select>
                </div>
                {field('date', 'Date',
                  <input id="b-date" className="input" type="date" min={isoDate(new Date())} value={form.date} onChange={e => set('date', e.target.value)} />,
                  'Pick a date')}
                <div className="field">
                  <label htmlFor="b-time">Time slot</label>
                  <select id="b-time" className="input select" value={form.time} onChange={e => set('time', e.target.value)}>
                    {SLOTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="field full">
                  <span className="label">Where?</span>
                  <div className="seg">
                    {[['Showroom', 'At showroom'], ['Home', 'At my home']].map(([v, l]) => (
                      <label key={v}>
                        <input type="radio" name="where" value={v} checked={form.where === v} onChange={() => set('where', v)} />
                        <span>{l}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button className="btn btn-primary btn-block" type="submit">Confirm test drive</button>
            </form>
          )}
        </Reveal>

        <Reveal as="aside" className="panel why">
          <h3>Why test drive with us?</h3>
          <ul className="checks">
            <li>Home test drive anywhere inside Dhaka city</li>
            <li>Auction sheet &amp; mileage verification on every reconditioned car</li>
            <li>150-point inspection report before delivery</li>
            <li>Free first service + 1 year engine warranty</li>
            <li>Same-day loan pre-approval with partner banks</li>
          </ul>
          <div className="hours">
            <div><span>Sat – Thu</span><b>10:00 AM – 9:00 PM</b></div>
            <div><span>Friday</span><b>3:00 PM – 9:00 PM</b></div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

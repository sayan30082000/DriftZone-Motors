import { useState } from 'react'
import Reveal from './Reveal'
import { CARS, byId } from '../data/cars'
import { emiFor, formatBDT, scrollToId } from '../lib/utils'

const TENURES = [12, 24, 36, 48, 60, 72]

export default function EmiCalculator({ onBook }) {
  const [carId, setCarId] = useState(String(CARS[0].id))
  const [price, setPrice] = useState(CARS[0].price)
  const [down, setDown] = useState(30)
  const [rate, setRate] = useState(9.5)
  const [months, setMonths] = useState(48)

  const p = Math.max(0, Number(price) || 0)
  const downAmt = (p * down) / 100
  const loan = p - downAmt
  const monthly = emiFor(loan, rate, months)
  const total = monthly * months
  const interest = total - loan
  const principalPct = total ? (loan / total) * 100 : 100

  return (
    <section className="block" id="emi">
      <div className="container">
        <Reveal className="sec-head">
          <div>
            <p className="eyebrow">Finance</p>
            <h2>EMI calculator</h2>
          </div>
          <p>Pick a car or type any price. Rates are indicative — final terms depend on the partner bank.</p>
        </Reveal>

        <Reveal className="emi">
          <div className="panel">
            <div className="field">
              <label htmlFor="emiCar">Car</label>
              <select
                id="emiCar"
                className="input select"
                value={carId}
                onChange={e => {
                  setCarId(e.target.value)
                  const c = byId(Number(e.target.value))
                  if (c) setPrice(c.price)
                }}
              >
                {CARS.map(c => <option key={c.id} value={c.id}>{c.brand} {c.model} ({c.year})</option>)}
                <option value="">Custom price…</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="emiPrice">Car price (৳)</label>
              <input
                id="emiPrice"
                className="input"
                type="number"
                min="100000"
                step="10000"
                value={price}
                onChange={e => {
                  setPrice(e.target.value)
                  setCarId('')
                }}
              />
            </div>
            <div className="field">
              <div className="label-row"><label htmlFor="emiDown">Down payment</label><output>{down}%</output></div>
              <input id="emiDown" type="range" min="10" max="70" value={down} onChange={e => setDown(+e.target.value)} />
            </div>
            <div className="field">
              <div className="label-row"><label htmlFor="emiRate">Interest rate (yearly)</label><output>{rate}%</output></div>
              <input id="emiRate" type="range" min="7" max="15" step="0.25" value={rate} onChange={e => setRate(+e.target.value)} />
            </div>
            <div className="field">
              <span className="label">Tenure</span>
              <div className="tenure" role="radiogroup" aria-label="Loan tenure">
                {TENURES.map(m => (
                  <button key={m} role="radio" aria-checked={months === m} className={months === m ? 'on' : ''} onClick={() => setMonths(m)}>
                    {m / 12} yr
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="panel emi-result">
            <span className="label">Monthly EMI</span>
            <strong className="emi-big">{formatBDT(monthly)}<small> /month</small></strong>
            <div className="emi-bar">
              <span style={{ width: `${principalPct}%` }} className="p" />
              <span style={{ width: `${100 - principalPct}%` }} className="i" />
            </div>
            <div className="legend"><span><i className="dot p" />Principal</span><span><i className="dot i" />Interest</span></div>
            <dl className="emi-break">
              <div><dt>Down payment</dt><dd>{formatBDT(downAmt)}</dd></div>
              <div><dt>Loan amount</dt><dd>{formatBDT(loan)}</dd></div>
              <div><dt>Total interest</dt><dd>{formatBDT(interest)}</dd></div>
              <div><dt>Total payable</dt><dd>{formatBDT(total + downAmt)}</dd></div>
            </dl>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (carId) onBook(Number(carId))
                scrollToId('booking')
              }}
            >
              Talk to a finance advisor
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

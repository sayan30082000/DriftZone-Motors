import Reveal from './Reveal'
import { Cash, Cog, Shield, Sparkle, Swap, Wrench } from './Icons'

const SERVICES = [
  [Wrench, 'Servicing & Repair', 'Engine tuning, AC, suspension and computer diagnostics by certified mechanics.'],
  [Shield, 'Insurance & Papers', 'BRTA registration, tax token, fitness and comprehensive insurance — handled for you.'],
  [Cash, 'Car Loan & EMI', 'Bank partner financing up to 70% with 12–72 month plans. Try the EMI calculator below.'],
  [Swap, 'Trade-in / Exchange', 'Bring your old car, get an instant valuation and use it as down payment.'],
  [Sparkle, 'Detailing & Ceramic', 'Paint correction, ceramic coating, PPF and interior deep clean.'],
  [Cog, 'Genuine Parts', 'OEM parts, tyres, batteries and accessories with warranty.'],
]

export default function Services() {
  return (
    <section className="block alt" id="services">
      <div className="container">
        <Reveal className="sec-head">
          <div>
            <p className="eyebrow">Beyond the sale</p>
            <h2>Everything your car needs</h2>
          </div>
          <p>One shop for buying, servicing, insuring and upgrading — so you never have to run around Dhaka for paperwork or parts.</p>
        </Reveal>
        <div className="services">
          {SERVICES.map(([Icon, title, text]) => (
            <Reveal as="article" className="service" key={title}>
              <div className="s-icon"><Icon /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

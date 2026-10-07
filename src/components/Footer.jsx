import { Logo } from './Navbar'
import { Chat } from './Icons'
import { CARS, SHOP } from '../data/cars'
import { whatsappUrl } from '../lib/utils'

export default function Footer() {
  return (
    <>
      <footer className="footer" id="contact">
        <div className="container footer-grid">
          <div>
            <Logo />
            <p className="muted">Brand new &amp; reconditioned cars, finance and service — under one roof.</p>
          </div>
          <div>
            <h4>Visit</h4>
            <p className="muted">{SHOP.address[0]}<br />{SHOP.address[1]}</p>
            <a className="link" href={SHOP.mapsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps →</a>
          </div>
          <div>
            <h4>Talk to us</h4>
            <p className="muted">
              <a href={`tel:${SHOP.phone.replace(/[^\d+]/g, '')}`}>{SHOP.phone}</a>
              <br />
              <a href={`mailto:${SHOP.email}`}>{SHOP.email}</a>
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            <p className="muted">
              <a href="#showroom">Showroom</a><br />
              <a href="#services">Services</a><br />
              <a href="#emi">EMI calculator</a>
            </p>
          </div>
        </div>
        <div className="container">
          <details className="credits">
            <summary>Photo &amp; 3D model credits</summary>
            <p>
              Hero 3D car: <a href="https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept" target="_blank" rel="noopener noreferrer">Car Concept</a> by Eric Chadwick,
              © 2024 Darmstadt Graphics Group GmbH, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a> — logos removed, optimised for web.
            </p>
            <p>Car photos from Wikimedia Commons (resized and cropped). Brand names belong to their owners.</p>
            <ul>
              {CARS.map(c => (
                <li key={c.id}>
                  {c.brand} {c.model}: <a href={c.photo.source} target="_blank" rel="noopener noreferrer">photo</a> by {c.photo.author},{' '}
                  <a href={c.photo.licenseUrl} target="_blank" rel="noopener noreferrer">{c.photo.license}</a>
                </li>
              ))}
            </ul>
          </details>
        </div>
        <div className="container copy">© {new Date().getFullYear()} {SHOP.name}. All rights reserved.</div>
      </footer>

      <a className="wa-float" href={whatsappUrl(`Hi ${SHOP.name}! I'm interested in a car.`)} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <Chat />
      </a>
    </>
  )
}

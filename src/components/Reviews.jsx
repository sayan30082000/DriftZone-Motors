import Reveal from './Reveal'

// SAMPLE CONTENT — replace with real customer reviews before going live.
const REVIEWS = [
  { stars: 5, text: 'Paperwork, insurance, number plate — everything was ready in 3 days. The test drive at night was a nice touch.', name: 'Rafiq H.', car: 'Toyota Premio owner' },
  { stars: 5, text: 'Traded in my old Axio and got a fair price. EMI on the Vezel ended up lower than I calculated.', name: 'Nusrat J.', car: 'Honda Vezel owner' },
  { stars: 4, text: 'Great range of reconditioned cars with real auction sheets. Free first service saved me a lot.', name: 'Tanvir A.', car: 'Toyota Hilux owner' },
]

export default function Reviews() {
  return (
    <section className="block alt" id="reviews">
      <div className="container">
        <Reveal className="sec-head">
          <div>
            <p className="eyebrow">Owners</p>
            <h2>What drivers say</h2>
          </div>
        </Reveal>
        <div className="reviews">
          {REVIEWS.map(r => (
            <Reveal as="figure" className="review" key={r.name}>
              <div className="stars" aria-label={`${r.stars} out of 5`}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
              <blockquote>{r.text}</blockquote>
              <figcaption>
                <span className="avatar">{r.name[0]}</span>
                <span><b>{r.name}</b><small>{r.car}</small></span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

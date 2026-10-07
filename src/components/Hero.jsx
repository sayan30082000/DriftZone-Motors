import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import CarArt from './CarArt'
import { hasWebGL, prefersReducedMotion, scrollToId } from '../lib/utils'

// three.js + the scene load in their own chunk so the rest of the page isn't blocked
const DriftScene = lazy(() => import('./hero/DriftScene.jsx'))

/** If WebGL crashes for any reason, fall back to the flat illustration instead of a blank hero. */
class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onFail?.()
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function FlatCar() {
  return (
    <div className="hero-fallback">
      <CarArt body="sports" color="#d10a0a" />
    </div>
  )
}

export default function Hero() {
  const heroRef = useRef(null)
  const [webgl] = useState(() => hasWebGL())
  const [reduced] = useState(() => prefersReducedMotion())
  const [landed, setLanded] = useState(!webgl)
  const [run, setRun] = useState(0)

  const onLanded = useCallback(() => setLanded(true), [])

  // never leave the headline hidden — e.g. a very slow phone or a background tab
  useEffect(() => {
    const id = setTimeout(() => setLanded(true), 7000)
    return () => clearTimeout(id)
  }, [])

  return (
    <section className={`hero${landed ? ' landed' : ''}`} id="home" ref={heroRef}>
      <div className="hero-canvas" aria-hidden="true">
        {webgl ? (
          <SceneBoundary fallback={<FlatCar />} onFail={onLanded}>
            <Suspense fallback={null}>
              <DriftScene run={run} instant={reduced} onLanded={onLanded} eventSource={heroRef} />
            </Suspense>
          </SceneBoundary>
        ) : (
          <FlatCar />
        )}
      </div>

      <div className="hero-copy">
        <p className="eyebrow">Dhaka&apos;s drift-ready showroom</p>
        <h1>
          Feel the <span className="grad">Drift.</span>
          <br />
          Own the Road.
        </h1>
        <p className="lead">
          20+ brand new &amp; reconditioned cars — sedans, SUVs, sports, electric — with easy EMI and a free first service.
        </p>
        <div className="cta">
          <button className="btn btn-primary" onClick={() => scrollToId('showroom')}>Explore Showroom</button>
          <button className="btn btn-ghost" onClick={() => scrollToId('booking')}>Book a Test Drive</button>
        </div>
      </div>

      {webgl && !reduced && (
        <button className="replay" onClick={() => setRun(r => r + 1)} aria-label="Replay drift animation">
          <svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
          Replay drift
        </button>
      )}
    </section>
  )
}

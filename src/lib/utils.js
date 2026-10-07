import { SHOP } from '../data/cars'

/** ৳ 42,50,000 — Bangladeshi lakh/crore grouping */
export const formatBDT = n => '৳ ' + Math.round(n).toLocaleString('en-IN')

export const formatKm = km => (km ? km.toLocaleString('en-IN') + ' km' : 'Zero km')

/** Standard reducing-balance EMI */
export function emiFor(principal, yearlyRate, months) {
  const r = yearlyRate / 12 / 100
  if (!r) return principal / months
  const f = Math.pow(1 + r, months)
  return (principal * r * f) / (f - 1)
}

/** Lighten (pct > 0) or darken (pct < 0) a #rrggbb colour */
export function shade(hex, pct) {
  const n = parseInt(hex.slice(1), 16)
  const t = pct < 0 ? 0 : 255
  const p = Math.abs(pct)
  const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round((t - v) * p + v))
  return `rgb(${c.join(',')})`
}

export const whatsappUrl = text => `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(text)}`

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

/** localStorage that never throws (private mode, blocked storage, etc.) */
export const storage = {
  get(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key))
      return v ?? fallback
    } catch {
      return fallback
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage unavailable */
    }
  },
}

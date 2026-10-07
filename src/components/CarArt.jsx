import { useId } from 'react'
import { shade } from '../lib/utils'

/*
  Side-view car illustrations for cards, tiles and the compare table.
  All bodies share a 600×210 viewBox; the ground line is y = 192.
*/
const BODIES = {
  sports: {
    wheels: [138, 462], r: 34, bottom: 152, belt: 104,
    body: 'M30 152 C28 132 38 116 66 110 C120 100 180 72 262 60 L328 58 C378 62 418 80 458 98 L544 108 C570 112 582 130 580 152 Z',
    win: 'M188 104 C216 86 244 74 272 71 L324 69 C356 72 386 86 408 104 Z',
    pillars: [300], head: [550, 118], tail: [34, 122],
    extra: c => <path d="M30 112 L94 104 L96 95 L34 99 Z" fill={shade(c, -0.45)} />,
  },
  sedan: {
    wheels: [142, 458], r: 35, bottom: 150, belt: 100,
    body: 'M24 150 C22 128 30 112 56 108 L150 100 C188 70 222 54 268 52 L344 52 C390 54 424 74 452 96 L544 106 C572 110 584 128 582 150 Z',
    win: 'M174 100 C206 76 234 63 270 62 L340 62 C374 64 402 80 426 100 Z',
    pillars: [300], head: [554, 115], tail: [28, 118],
  },
  suv: {
    wheels: [142, 464], r: 40, bottom: 146, belt: 80,
    body: 'M22 146 L22 94 C22 76 30 64 50 62 L118 58 L166 26 C172 22 180 20 190 20 L362 20 C382 20 394 26 404 36 L452 76 L548 86 C574 90 584 106 584 126 L584 146 Z',
    win: 'M134 80 L134 66 L178 34 L358 31 C368 31 376 34 382 40 L426 80 Z',
    pillars: [242, 342], head: [558, 98], tail: [24, 100],
    extra: c => <path d="M176 17 H366" stroke={shade(c, -0.55)} strokeWidth="5" strokeLinecap="round" />,
  },
  hatch: {
    wheels: [178, 428], r: 33, bottom: 152, belt: 98,
    body: 'M92 152 L90 110 C90 92 98 80 112 74 L160 50 C170 45 178 43 190 43 L300 43 C328 43 348 54 366 72 L404 96 L494 106 C518 110 528 128 526 152 Z',
    win: 'M120 98 L120 84 L166 60 C174 55 182 54 192 54 L298 54 C320 54 336 62 350 76 L370 98 Z',
    pillars: [206, 288], head: [500, 114], tail: [94, 106],
  },
  pickup: {
    wheels: [142, 468], r: 40, bottom: 146, belt: 80,
    body: 'M20 146 L20 84 L262 84 L272 34 C274 26 280 22 290 22 L392 22 C406 22 416 28 424 38 L456 78 L552 88 C576 92 586 108 586 128 L586 146 Z',
    win: 'M284 80 L290 35 C291 32 293 31 297 31 L388 31 C398 31 404 34 410 42 L438 80 Z',
    pillars: [360], head: [562, 100], tail: [22, 98],
    extra: c => (
      <>
        <path d="M20 84 H262" stroke={shade(c, -0.5)} strokeWidth="4" />
        <path d="M24 92 V140" stroke="rgba(0,0,0,.35)" strokeWidth="1.5" />
      </>
    ),
  },
  van: {
    wheels: [132, 480], r: 36, bottom: 150, belt: 82,
    body: 'M18 150 L18 42 C18 26 30 16 48 16 L440 16 C468 16 488 28 504 48 L546 94 C570 100 584 114 584 132 L584 150 Z',
    win: 'M40 82 L40 30 L448 30 C466 30 480 40 490 52 L514 82 Z',
    pillars: [150, 266, 386], head: [564, 108], tail: [20, 96],
  },
}

function Wheel({ cx, cy, r }) {
  return (
    <g className="wheel">
      <circle cx={cx} cy={cy} r={r} fill="#0e1015" />
      <circle cx={cx} cy={cy} r={r * 0.84} fill="none" stroke="#252932" strokeWidth={r * 0.1} />
      <circle cx={cx} cy={cy} r={r * 0.66} fill="#1b1e25" stroke="#aeb4be" strokeWidth="2" />
      {[0, 1, 2, 3, 4].map(k => (
        <path
          key={k}
          d={`M${cx - r * 0.07} ${cy} L${cx - r * 0.13} ${cy - r * 0.6} L${cx + r * 0.13} ${cy - r * 0.6} L${cx + r * 0.07} ${cy} Z`}
          fill="#c9ced6"
          transform={`rotate(${k * 72} ${cx} ${cy})`}
        />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.16} fill="#2d323b" stroke="#c9ced6" strokeWidth="1.5" />
    </g>
  )
}

export default function CarArt({ body = 'sedan', color = '#e10600', electric = false, className }) {
  const id = 'c' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const B = BODIES[body] ?? BODIES.sedan
  const cy = 192 - B.r
  const R = B.r + 6
  const dy = B.bottom - cy
  const dx = Math.sqrt(R * R - dy * dy)
  const [hx, hy] = B.head
  const [tx, ty] = B.tail
  const [w0, w1] = B.wheels

  return (
    <svg viewBox="0 0 600 210" className={className} aria-hidden="true" overflow="visible">
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={shade(color, 0.3)} />
          <stop offset=".45" stopColor={color} />
          <stop offset="1" stopColor={shade(color, -0.5)} />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".45" />
          <stop offset=".32" stopColor="#fff" stopOpacity=".07" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#34445c" />
          <stop offset="1" stopColor="#0a1018" />
        </linearGradient>
        <radialGradient id={`${id}s`}>
          <stop offset="0" stopColor="#000" stopOpacity=".6" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}cb`}><path d={B.body} /></clipPath>
        <clipPath id={`${id}cw`}><path d={B.win} /></clipPath>
      </defs>

      <ellipse cx="300" cy="195" rx="290" ry="11" fill={`url(#${id}s)`} />
      <path d={B.body} fill={`url(#${id}b)`} />
      <g clipPath={`url(#${id}cb)`}>
        <path d={`M0 ${B.belt + 20} H600`} stroke="#fff" strokeOpacity=".16" strokeWidth="2" />
        <rect x="0" y={B.bottom - 12} width="600" height="12" fill="#000" fillOpacity=".3" />
        {B.pillars.map(x => (
          <line key={x} x1={x} y1={B.belt} x2={x + 4} y2={B.bottom - 8} stroke="rgba(0,0,0,.35)" strokeWidth="1.5" />
        ))}
      </g>
      <path d={B.win} fill={`url(#${id}w)`} />
      <g clipPath={`url(#${id}cw)`}>
        <path d={`M${w0 + 70} 0 h40 l-70 210 h-40 z`} fill="#fff" fillOpacity=".09" />
        {B.pillars.map(x => (
          <rect key={x} x={x - 4} y="0" width="8" height="210" fill={shade(color, -0.4)} />
        ))}
      </g>
      <path d={B.body} fill={`url(#${id}g)`} />
      {B.extra?.(color)}
      {electric && <path d={`M${w1 - 92} ${B.belt + 16} l-9 13 h7 l-3 10 l10 -14 h-7 z`} fill="#38c8ff" />}
      <path
        d={`M${hx - 22} ${hy - 4} Q${hx} ${hy - 8} ${hx + 18} ${hy - 1} L${hx + 16} ${hy + 5} Q${hx - 4} ${hy + 6} ${hx - 22} ${hy + 3} Z`}
        fill="#fff6d8"
      />
      <rect x={tx} y={ty - 4} width="18" height="8" rx="3" fill="#ff2626" />
      {B.wheels.map(x => (
        <path key={x} d={`M${x - dx} ${B.bottom} A${R} ${R} 0 ${dy > 0 ? 1 : 0} 1 ${x + dx} ${B.bottom} Z`} fill="#07080b" />
      ))}
      <Wheel cx={w0} cy={cy} r={B.r} />
      <Wheel cx={w1} cy={cy} r={B.r} />
    </svg>
  )
}

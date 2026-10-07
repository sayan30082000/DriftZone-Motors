# DriftZone Motors 🏎️

A car showroom website built with **React + Vite**. When the site opens, a **realistic 3D car** (Three.js through react-three-fiber) enters from the far road, turns toward the camera and does a handbrake drift into the centre of the screen. The intro has tyre smoke, skid marks, body roll, counter-steer and brake lights.

## Features

- **3D drift intro** with a real glTF car model (`public/models/car.glb`, 3 MB). It has clear-coat paint, glass you can see the interior through, environment reflections, real-time shadows, glowing brake and head lights, steering and spinning wheels, and a glowing stage ring where it stops.
- **Shop by type**: 23 models in 8 types (Sedan, SUV, Sports, Hatchback, Pickup, Microbus, Electric, Luxury) with **real photos**, search and sort.
- **Wishlist**, saved in the browser.
- **Compare** up to 3 cars side by side. The best value in each row is highlighted.
- **EMI calculator** for down payment, interest and tenure.
- **Test-drive booking** with Bangladeshi mobile number validation and a WhatsApp hand-off.
- Services, reviews, stats counters, a brand marquee and a floating WhatsApp button.
- Responsive layout, from phones up to desktops.
- `prefers-reduced-motion` skips the intro. If the browser has no WebGL, the site shows a flat illustration instead.

## Run locally

Requires **Node 20.19+**.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the production build
```

## Customise

| What | Where |
| --- | --- |
| Shop name, WhatsApp number, phone, email, address | `src/data/cars.js` → `SHOP` |
| Cars (name, price, colours, specs, badge) | `src/data/cars.js` → `CARS` |
| Customer reviews (**sample text, replace before launch**) | `src/components/Reviews.jsx` |
| Car photos | `public/cars/<id>.webp` (3:2, e.g. 900×600) + credits in `src/data/photos.js` |
| Hero 3D car | `public/models/car.glb` (see "Using another 3D car" below); paint colour → `color` prop of `RealCar` |
| Drift path, timing, slip angle, steering | `src/components/hero/driftPath.js` |
| Camera framing, smoke and skid intensity | `src/components/hero/DriftScene.jsx` |
| Lights, ground, skyline | `src/components/hero/Stage.jsx` |
| Colours and fonts | `src/index.css` → `:root` |

## Project structure

```
src/
├── App.jsx                 # page layout + shared state (wishlist, compare, booking car)
├── main.jsx
├── index.css
├── data/cars.js            # SHOP settings + inventory
├── lib/
│   ├── utils.js            # ৳ formatting, EMI maths, storage, helpers
│   └── toast.jsx
└── components/
    ├── Hero.jsx            # lazy-loads the 3D scene, reveals the headline on landing
    ├── hero/
    │   ├── DriftScene.jsx  # Canvas + animation controller (car, camera, smoke, skids)
    │   ├── driftPath.js    # the drift trajectory: path, speed, slip, steering vs time
    │   ├── RealCar.jsx     # loads car.glb and rigs it (suspension, steering, wheel spin, lights)
    │   ├── Stage.jsx       # asphalt, road paint, skyline, lights, reflections
    │   ├── Smoke.jsx       # GPU tyre-smoke particles
    │   └── SkidMarks.jsx   # instanced skid-mark decals
    ├── CarArt.jsx          # SVG car illustrations for cards
    ├── Navbar.jsx, Stats.jsx, Showroom.jsx, CarCard.jsx, Compare.jsx,
    └── Services.jsx, EmiCalculator.jsx, Reviews.jsx, Booking.jsx, Footer.jsx
```

## Credits and licences

- **3D car:** [Car Concept](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept) by Eric Chadwick, © 2024 Darmstadt Graphics Group GmbH, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The licence excludes the Khronos and 3D Commerce logos, so they were removed from the textures. The web version was optimised with glTF-Transform (WebP textures, meshopt). The full licence is in `public/models/CarConcept-LICENSE.md`.
- **Car photos:** from Wikimedia Commons, under CC BY / CC BY-SA / CC0 licences. Each photo was resized and cropped. The author and licence for each photo are listed in the site footer and in `src/data/photos.js`. Keep those credits while the photos are in use. Replacing them with your own showroom photos is recommended.

## Using another 3D car

Put any `.glb` at `public/models/car.glb`. The model needs:
- the nose pointing **+Z**
- metres as the unit
- wheel nodes named `WheelFrontL`, `WheelFrontR`, `WheelRearL` and `WheelRearR`. Other names can be set in `WHEEL_NODES` in `RealCar.jsx`.

`RealCar.jsx` centres the model, puts it on the ground, measures the wheels and builds the steering and suspension rig automatically. Optional material names it looks for are `Glass`, `Brakelight`, `Headlight`, `License` and `Paint 1 Carmine`. Compress big models first, for example:

```bash
npx @gltf-transform/cli optimize in.glb public/models/car.glb --compress meshopt --texture-compress webp
```

## Deploy

- **Netlify**: connect the repo. `netlify.toml` already sets the build to `npm run build` with publish folder `dist`.
- **Vercel**: import the repo. The Vite preset works with no changes.
- **GitHub Pages**: add `base: '/<repo-name>/'` to `vite.config.js`, then publish `dist/`.

## Notes

- The booking form does not save to a server yet. It shows a confirmation and opens WhatsApp with the details filled in. Add a backend (for example Supabase or Formspree) to store bookings.
- The 3D scene is code-split. The page shell loads first (about 80 KB gzipped) and three.js loads after it.

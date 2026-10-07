import { PHOTOS } from './photos'

/* ============ Shop settings — change these ============ */
export const SHOP = {
  name: 'DriftZone Motors',
  whatsapp: '8801700000000', // country code + number, no "+"
  phone: '+880 1700-000000',
  email: 'hello@driftzone.example',
  address: ['House 00, Road 00, Tejgaon I/A', 'Dhaka 1208, Bangladesh'],
  mapsUrl: 'https://maps.google.com/?q=Tejgaon+Dhaka',
}

/* ============ Inventory ============ */
// body  = which silhouette to draw (see components/CarArt.jsx)
// type  = which "shop by type" tile it belongs to
const INVENTORY = [
  { id: 1,  brand: 'Toyota',        model: 'Premio F EX',        year: 2022, type: 'Sedan',     body: 'sedan',  price: 4250000,  fuel: 'Octane',   trans: 'Automatic', engine: '1500 cc',       km: 12000, seats: 5,  cond: 'Reconditioned', colors: ['#e9ecef', '#15171c', '#9aa1ab'], badge: 'Best seller' },
  { id: 2,  brand: 'Honda',         model: 'Civic EX Turbo',     year: 2023, type: 'Sedan',     body: 'sedan',  price: 5500000,  fuel: 'Octane',   trans: 'CVT',       engine: '1500 cc Turbo', km: 0,     seats: 5,  cond: 'Brand new',     colors: ['#b3001b', '#e9ecef', '#2d3340'], badge: 'New' },
  { id: 3,  brand: 'Toyota',        model: 'Allion A15',         year: 2021, type: 'Sedan',     body: 'sedan',  price: 3800000,  fuel: 'Octane',   trans: 'Automatic', engine: '1500 cc',       km: 21000, seats: 5,  cond: 'Reconditioned', colors: ['#c8ccd2', '#1d2b4f', '#e9ecef'] },
  { id: 4,  brand: 'Toyota',        model: 'Axio Hybrid',        year: 2020, type: 'Sedan',     body: 'sedan',  price: 2450000,  fuel: 'Hybrid',   trans: 'Automatic', engine: '1500 cc',       km: 38000, seats: 5,  cond: 'Reconditioned', colors: ['#9aa1ab', '#e9ecef', '#5a1e1e'] },
  { id: 5,  brand: 'Nissan',        model: 'GT-R Premium',       year: 2021, type: 'Sports',    body: 'sports', price: 32000000, fuel: 'Octane',   trans: 'DCT',       engine: '3800 cc V6 TT', km: 9000,  seats: 4,  cond: 'Reconditioned', colors: ['#c0c4ca', '#ff6a00', '#15171c'], badge: 'Hot' },
  { id: 6,  brand: 'Toyota',        model: 'GR Supra',           year: 2022, type: 'Sports',    body: 'sports', price: 14500000, fuel: 'Octane',   trans: 'Automatic', engine: '3000 cc Turbo', km: 6000,  seats: 2,  cond: 'Reconditioned', colors: ['#ffc400', '#b3001b', '#15171c'], badge: 'Hot' },
  { id: 7,  brand: 'Ford',          model: 'Mustang GT',         year: 2022, type: 'Sports',    body: 'sports', price: 13000000, fuel: 'Octane',   trans: 'Automatic', engine: '5000 cc V8',    km: 8000,  seats: 4,  cond: 'Reconditioned', colors: ['#1e5bd8', '#ff6a00', '#15171c'] },
  { id: 8,  brand: 'Toyota',        model: 'GR86',               year: 2023, type: 'Sports',    body: 'sports', price: 9500000,  fuel: 'Octane',   trans: 'Manual',    engine: '2400 cc',       km: 0,     seats: 4,  cond: 'Brand new',     colors: ['#e9ecef', '#1e5bd8', '#b3001b'] },
  { id: 9,  brand: 'Toyota',        model: 'Land Cruiser Prado', year: 2023, type: 'SUV',       body: 'suv',    price: 16500000, fuel: 'Diesel',   trans: 'Automatic', engine: '2800 cc',       km: 0,     seats: 7,  cond: 'Brand new',     colors: ['#15171c', '#e9ecef', '#4a5340'], badge: 'Premium' },
  { id: 10, brand: 'Mitsubishi',    model: 'Pajero Sport',       year: 2023, type: 'SUV',       body: 'suv',    price: 6200000,  fuel: 'Diesel',   trans: 'Automatic', engine: '2400 cc',       km: 0,     seats: 7,  cond: 'Brand new',     colors: ['#c0c4ca', '#7a1414', '#15171c'] },
  { id: 11, brand: 'Hyundai',       model: 'Tucson',             year: 2024, type: 'SUV',       body: 'suv',    price: 5800000,  fuel: 'Octane',   trans: 'Automatic', engine: '2000 cc',       km: 0,     seats: 5,  cond: 'Brand new',     colors: ['#1d2b4f', '#e9ecef', '#5b6470'], badge: 'New' },
  { id: 12, brand: 'Honda',         model: 'Vezel e:HEV Z',      year: 2022, type: 'SUV',       body: 'suv',    price: 3400000,  fuel: 'Hybrid',   trans: 'Automatic', engine: '1500 cc',       km: 15000, seats: 5,  cond: 'Reconditioned', colors: ['#c43b1c', '#e9ecef', '#2a2e36'] },
  { id: 13, brand: 'Tesla',         model: 'Model 3',            year: 2024, type: 'Electric',  body: 'sedan',  price: 7500000,  fuel: 'Electric', trans: 'Automatic', engine: '513 km range',  km: 0,     seats: 5,  cond: 'Brand new',     colors: ['#e9ecef', '#b3001b', '#15171c'], badge: 'EV' },
  { id: 14, brand: 'BYD',           model: 'Atto 3',             year: 2024, type: 'Electric',  body: 'suv',    price: 4800000,  fuel: 'Electric', trans: 'Automatic', engine: '420 km range',  km: 0,     seats: 5,  cond: 'Brand new',     colors: ['#3a7bd5', '#e9ecef', '#5b6470'], badge: 'EV' },
  { id: 15, brand: 'Mercedes-Benz', model: 'E 200 AMG Line',     year: 2023, type: 'Luxury',    body: 'sedan',  price: 14000000, fuel: 'Octane',   trans: 'Automatic', engine: '2000 cc Turbo', km: 0,     seats: 5,  cond: 'Brand new',     colors: ['#15171c', '#c0c4ca', '#24324a'], badge: 'Luxury' },
  { id: 16, brand: 'BMW',           model: '520i Sedan',         year: 2024, type: 'Luxury',    body: 'sedan',  price: 12500000, fuel: 'Octane',   trans: 'Automatic', engine: '2000 cc Turbo', km: 0,     seats: 5,  cond: 'Brand new',     colors: ['#1c3d7a', '#15171c', '#e9ecef'], badge: 'Luxury' },
  { id: 17, brand: 'Suzuki',        model: 'Swift GLX',          year: 2024, type: 'Hatchback', body: 'hatch',  price: 2150000,  fuel: 'Octane',   trans: 'AGS',       engine: '1200 cc',       km: 0,     seats: 5,  cond: 'Brand new',     colors: ['#ff6a00', '#e9ecef', '#1e5bd8'], badge: 'New' },
  { id: 18, brand: 'Toyota',        model: 'Aqua G',             year: 2021, type: 'Hatchback', body: 'hatch',  price: 1800000,  fuel: 'Hybrid',   trans: 'Automatic', engine: '1500 cc',       km: 30000, seats: 5,  cond: 'Reconditioned', colors: ['#7fd1c7', '#e9ecef', '#d63a3a'] },
  { id: 19, brand: 'Honda',         model: 'Fit RS',             year: 2020, type: 'Hatchback', body: 'hatch',  price: 1650000,  fuel: 'Octane',   trans: 'CVT',       engine: '1300 cc',       km: 42000, seats: 5,  cond: 'Reconditioned', colors: ['#ffc400', '#e9ecef', '#15171c'] },
  { id: 20, brand: 'Toyota',        model: 'Hilux Revo',         year: 2023, type: 'Pickup',    body: 'pickup', price: 4800000,  fuel: 'Diesel',   trans: 'Manual',    engine: '2400 cc',       km: 0,     seats: 5,  cond: 'Brand new',     colors: ['#e9ecef', '#7a1414', '#2a2e36'] },
  { id: 21, brand: 'Mitsubishi',    model: 'L200 Triton',        year: 2022, type: 'Pickup',    body: 'pickup', price: 3900000,  fuel: 'Diesel',   trans: 'Manual',    engine: '2400 cc',       km: 10000, seats: 5,  cond: 'Reconditioned', colors: ['#c0c4ca', '#e07b00', '#15171c'] },
  { id: 22, brand: 'Toyota',        model: 'Noah Si',            year: 2022, type: 'Microbus',  body: 'van',    price: 3600000,  fuel: 'Octane',   trans: 'Automatic', engine: '2000 cc',       km: 18000, seats: 8,  cond: 'Reconditioned', colors: ['#e9ecef', '#15171c', '#5b6470'] },
  { id: 23, brand: 'Toyota',        model: 'Hiace GL',           year: 2021, type: 'Microbus',  body: 'van',    price: 4500000,  fuel: 'Diesel',   trans: 'Manual',    engine: '2800 cc',       km: 25000, seats: 12, cond: 'Reconditioned', colors: ['#e9ecef', '#c0c4ca', '#1d2b4f'] },
]

export const CARS = INVENTORY.map(c => ({ ...c, photo: PHOTOS[c.id] }))

export const TYPES = [
  { name: 'Sedan', body: 'sedan', color: '#ff3b2f' },
  { name: 'SUV', body: 'suv', color: '#ff3b2f' },
  { name: 'Sports', body: 'sports', color: '#ff3b2f' },
  { name: 'Hatchback', body: 'hatch', color: '#ff3b2f' },
  { name: 'Pickup', body: 'pickup', color: '#ff3b2f' },
  { name: 'Microbus', body: 'van', color: '#ff3b2f' },
  { name: 'Electric', body: 'sedan', color: '#2f8cff', electric: true },
  { name: 'Luxury', body: 'sedan', color: '#c9a64b' },
]

export const BRANDS = ['Toyota', 'Honda', 'Nissan', 'Mitsubishi', 'Hyundai', 'Suzuki', 'BMW', 'Mercedes-Benz', 'Ford', 'Tesla', 'BYD', 'Mazda', 'Kia']

export const byId = id => CARS.find(c => c.id === id)

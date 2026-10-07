import { useCallback, useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import { Brands, Stats } from './components/Stats'
import Showroom from './components/Showroom'
import Services from './components/Services'
import EmiCalculator from './components/EmiCalculator'
import Reviews from './components/Reviews'
import Booking from './components/Booking'
import Footer from './components/Footer'
import { CompareBar, CompareModal } from './components/Compare'
import { CARS } from './data/cars'
import { scrollToId, storage } from './lib/utils'
import { useToast } from './lib/toast'

const MAX_COMPARE = 3

export default function App() {
  const toast = useToast()
  const [wish, setWish] = useState(() => storage.get('dz-wish', []))
  const [compare, setCompare] = useState([])
  const [compareOpen, setCompareOpen] = useState(false)
  const [bookCarId, setBookCarId] = useState(CARS[0].id)
  const [filters, setFilters] = useState({ type: 'All', q: '', sort: 'featured', wishOnly: false })

  useEffect(() => storage.set('dz-wish', wish), [wish])

  const onWish = useCallback(
    car => {
      const has = wish.includes(car.id)
      setWish(has ? wish.filter(id => id !== car.id) : [...wish, car.id])
      toast(has ? `Removed ${car.model}` : `Saved ${car.model} to wishlist`)
    },
    [wish, toast]
  )

  const onCompare = useCallback(
    id => {
      if (compare.includes(id)) return setCompare(compare.filter(x => x !== id))
      if (compare.length >= MAX_COMPARE) return toast(`You can compare up to ${MAX_COMPARE} cars`)
      setCompare([...compare, id])
    },
    [compare, toast]
  )

  const onTestDrive = useCallback(id => {
    setBookCarId(id)
    scrollToId('booking')
  }, [])

  const showWishlist = () => {
    setFilters(f => ({ ...f, type: 'All', wishOnly: true }))
    scrollToId('showroom')
    if (!wish.length) toast('Tap ♥ on any car to save it here')
  }

  return (
    <>
      <Navbar wishCount={wish.length} onShowWishlist={showWishlist} />
      <main>
        <Hero />
        <Stats />
        <Brands />
        <Showroom
          filters={filters}
          setFilters={setFilters}
          wish={wish}
          compare={compare}
          onWish={onWish}
          onCompare={onCompare}
          onTestDrive={onTestDrive}
        />
        <Services />
        <EmiCalculator onBook={setBookCarId} />
        <Reviews />
        <Booking carId={bookCarId} setCarId={setBookCarId} />
      </main>
      <Footer />

      <CompareBar ids={compare} onRemove={onCompare} onClear={() => setCompare([])} onOpen={() => setCompareOpen(true)} />
      <CompareModal open={compareOpen} ids={compare} onClose={() => setCompareOpen(false)} />
    </>
  )
}

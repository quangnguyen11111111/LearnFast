import { Outlet } from 'react-router'
import Header from '../components/header/HeaderGuest'
import Footer from '../components/Footer'

export default function GuestLayout() {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header display='sticky' shadow={true} />
      <main className='flex-1 '>
        <Outlet /> {/* nơi render các route con */}
      </main>
      <Footer />
    </div>
  )
}

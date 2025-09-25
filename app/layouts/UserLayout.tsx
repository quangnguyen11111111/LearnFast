import { Outlet } from 'react-router'
import Header from '../components/HeaderUser'
import Footer from '../components/Footer'

export default function UserLayout() {
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

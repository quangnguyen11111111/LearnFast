import { Outlet } from 'react-router'
import Header from '../components/header/HeaderUser'
import Sidebar from '~/components/Sidebar'

export default function UserLayout() {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header display='sticky' shadow={true} />
      <main className='flex-1 '>
        <Sidebar>
          <Outlet /> {/* nơi render các route con */}
        </Sidebar>
      </main>
    </div>
  )
}

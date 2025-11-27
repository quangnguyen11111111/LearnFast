import { Outlet } from 'react-router'
import Header from '../components/header/HeaderUser'

export default function CreateLayout() {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header display='static' shadow={false} linkTo='create-lesson'/>
      <main className='flex-1 bg-background '>
        <Outlet /> {/* nơi render các route con */}
      </main>
    </div>
  )
}

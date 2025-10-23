import { Outlet } from 'react-router'
import HeaderLearn from '~/components/header/HeaderLearn'
import Sidebar from '~/components/Sidebar'

export default function LearnLayout() {
  return (
    <div className='min-h-screen flex flex-col'>
      <HeaderLearn/>
      <main className='flex-1 '>
        <Outlet/>
      </main>
    </div>
  )
}

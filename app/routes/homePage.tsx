import Header from '~/components/Header'
import type { Route } from '../+types/root'
import Button from '~/components/Button'
import imgHomePage from '~/assets/HomePage.png'
import { NewspaperIcon } from '@heroicons/react/24/outline'
export function meta({}: Route.MetaArgs) {
  return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }]
}
const HomePage = () => {
  return (
    <div className='bg-background '>
      {/* homepage Top */}
      <div className=' container w-full 2xl:w-[80rem] mx-auto h-[calc(100vh-6rem)] items-center flex '>
        {/* left */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center '>
          <div className='max-md:order-2 px-6'>
            <p className='text-gray-800 text-6xl font-bold mb-3 leading-18'>Ghi nhớ kiến thức nhanh chóng, lâu dài</p>
            <Button variant='primary' className='p-4 font-bold'>
              Bắt đầu học ngay
            </Button>
          </div>
          {/* right */}
          <img src={imgHomePage} alt='' className=' grid max-md:order-1 size-full object-contain' />
        </div>
      </div>
      {/* Các tính năng nổi bật */}
      <div className='container w-full 2xl:w-[80rem] py-15 mx-auto items-center flex flex-col p-3'>
        <p className='text-3xl mb-5 font-semibold'>Các tính năng nổi bật</p>
        <div className='grid max-xl:grid-rows-2 grid-flow-col gap-5'>
          <div className='shadow p-4 rounded-lg flex gap-4 items-center cursor-pointer hover:scale-105 transition-all duration-200 select-none'>
            <NewspaperIcon className='size-10 text-blue-700' />
            <div className=''>
              <p className='font-bold text-lg'>Tạo bộ thẻ riêng</p>
              <p>Tự tạo và tùy chỉnh thẻ đọc</p>
            </div>
          </div>
          <div className='shadow p-4 rounded-lg flex gap-4 items-center cursor-pointer hover:scale-105 transition-all duration-200 select-none'>
            <NewspaperIcon className='size-10 text-blue-700' />
            <div className=''>
              <p className='font-bold text-lg'>Tạo bộ thẻ riêng</p>
              <p>Tự tạo và tùy chỉnh thẻ đọc</p>
            </div>
          </div>
          <div className='shadow p-4 rounded-lg flex gap-4 items-center cursor-pointer hover:scale-105 transition-all duration-200 select-none'>
            <NewspaperIcon className='size-10 text-blue-700' />
            <div className=''>
              <p className='font-bold text-lg'>Tạo bộ thẻ riêng</p>
              <p>Tự tạo và tùy chỉnh thẻ đọc</p>
            </div>
          </div>
          <div className='shadow p-4 rounded-lg flex gap-4 items-center cursor-pointer hover:scale-105 transition-all duration-200 select-none'>
            <NewspaperIcon className='size-10 text-blue-700' />
            <div className=''>
              <p className='font-bold text-lg'>Tạo bộ thẻ riêng</p>
              <p>Tự tạo và tùy chỉnh thẻ đọc</p>
            </div>
          </div>
        </div>
      </div>
      {/* Danh sách bộ thẻ nổi bật */}
      <div className='container w-full 2xl:w-[80rem] py-15 mx-auto items-center flex flex-col p-3'>
        <p className='font-bold text-3xl mb-5'>Danh sách bộ thẻ nổi bật</p>
        <div className='w-full grid grid-cols-2 max-xl:grid-cols-1 grid-flow-row gap-5'>
          {/* item */}
          <div className='flex justify-between shadow-md p-5 items-center'>
            <div className="">
              <p className='text-xl font-bold'>TOIEC vocabulary</p>
              <p className='inline text-gray-500'>50 từ <span> - Ngoc Huyen</span> </p>
            </div>
            <Button variant='primary' className='px-3 py-2 transition-all duration-300 font-bold'>
              Học ngay
            </Button>
          </div>
          {/* item */}
          <div className='flex justify-between shadow-md p-5 items-center'>
            <div className="">
              <p className='text-xl font-bold'>TOIEC vocabulary</p>
              <p className='inline text-gray-500'>50 từ <span> - Ngoc Huyen</span> </p>
            </div>
            <Button variant='primary' className='px-3 py-2 transition-all duration-300 font-bold'>
              Học ngay
            </Button>
          </div>
          {/* item */}
          <div className='flex justify-between shadow-md p-5 items-center'>
            <div className="">
              <p className='text-xl font-bold'>TOIEC vocabulary</p>
              <p className='inline text-gray-500'>50 từ <span> - Ngoc Huyen</span> </p>
            </div>
            <Button variant='primary' className='px-3 py-2 transition-all duration-300 font-bold'>
              Học ngay
            </Button>
          </div>
          {/* item */}
          <div className='flex justify-between shadow-md p-5 items-center'>
            <div className="">
              <p className='text-xl font-bold'>TOIEC vocabulary</p>
              <p className='inline text-gray-500'>50 từ <span> - Ngoc Huyen</span> </p>
            </div>
            <Button variant='primary' className='px-3 py-2 transition-all duration-300 font-bold'>
              Học ngay
            </Button>
          </div>
          {/* item */}
          <div className='flex justify-between shadow-md p-5 items-center'>
            <div className="">
              <p className='text-xl font-bold'>TOIEC vocabulary</p>
              <p className='inline text-gray-500'>50 từ <span> - Ngoc Huyen</span> </p>
            </div>
            <Button variant='primary' className='px-3 py-2 transition-all duration-300 font-bold'>
              Học ngay
            </Button>
          </div>
          {/* item */}
          <div className='flex justify-between shadow-md p-5 items-center'>
            <div className="">
              <p className='text-xl font-bold'>TOIEC vocabulary</p>
              <p className='inline text-gray-500'>50 từ <span> - Ngoc Huyen</span> </p>
            </div>
            <Button variant='primary' className='px-3 py-2 transition-all duration-300 font-bold'>
              Học ngay
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default HomePage

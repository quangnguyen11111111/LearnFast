import { NewspaperIcon } from '@heroicons/react/24/outline'
import Button from '~/components/button/Button'
import imgHomePage from '~/assets/HomePage.png'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

/* ---------------- FeatureCard ---------------- */
const FeatureCard = ({
  icon: Icon,
  title,
  description
}: {
  icon: React.ElementType
  title: string
  description: string
}) => (
  <div className='shadow p-4 rounded-lg flex gap-4 items-center cursor-pointer hover:scale-105 hover:bg-gray-100 transition-all duration-200 select-none'>
    <Icon className='size-10 text-blue-700' />
    <div>
      <p className='font-bold text-lg'>{title}</p>
      <p>{description}</p>
    </div>
  </div>
)

/* ---------------- DeckCard ---------------- */
const DeckCard = ({ title, count, author, handleClick }: { title: string; count: number; author: string; handleClick: () => void }) => (
  <div className='flex justify-between shadow-md border border-[#edeff4] p-5 items-center 
  relative after:h-1 after:w-0 hover:after:w-full after:bg-blue-500 after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300'
    onClick={handleClick}>
    <div>
      <p className='text-xl font-bold'>{title}</p>
      <p className='inline text-gray-500'>
        {count} từ <span> - {author}</span>
      </p>
    </div>
    <Button variant='primary' className='px-3 py-2 transition-all duration-300 font-bold'>
      Học ngay
    </Button>
  </div>
)

/* ---------------- HomePage ---------------- */
const HomePage = () => {
  const features = [
    { icon: NewspaperIcon, title: 'Tạo bộ thẻ riêng', description: 'Tự tạo và tùy chỉnh thẻ đọc' },
    { icon: NewspaperIcon, title: 'Ôn tập thông minh', description: 'Lặp lại ngắt quãng giúp nhớ lâu' },
    { icon: NewspaperIcon, title: 'Thống kê kết quả', description: 'Theo dõi tiến trình học tập' },
    { icon: NewspaperIcon, title: 'Học trên mọi thiết bị', description: 'Đồng bộ dữ liệu mọi nơi' }
  ]
  useEffect(()=>{
    if(!localStorage.getItem('guestFreeAccessUsed'))
    localStorage.setItem('guestFreeAccessUsed','false')
  },[])
  const navigate = useNavigate()

  const decks = [
    { title: 'TOEIC Vocabulary', count: 50, author: 'Ngọc Huyền' },
    { title: 'IELTS Writing Task 2', count: 40, author: 'Minh Anh' },
    { title: 'Ngữ pháp cơ bản', count: 30, author: 'Quang Thịnh' },
    { title: 'Tiếng Nhật N5', count: 60, author: 'Thu Trang' },
    { title: 'Kanji Master', count: 100, author: 'Hữu Phước' },
    { title: 'Business English', count: 80, author: 'Lan Anh' }
  ]

  return (
    <div className='bg-background'>
      {/* Top Section */}
      <div className='container w-full 2xl:w-[80rem] mx-auto py-26 flex items-center'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-center'>
          <div className='max-md:order-2 px-6'>
            <p className='text-gray-800 text-6xl font-bold mb-3 leading-[4.5rem]'>
              Ghi nhớ kiến thức nhanh chóng, lâu dài
            </p>
            <Button variant='primary' className='p-4 font-bold'>
              Bắt đầu học ngay
            </Button>
          </div>
          <img src={imgHomePage} alt='Homepage Illustration' className='max-md:order-1 w-full object-contain' />
        </div>
      </div>

      {/* Features Section */}
      <div className='bg-[#dbdfff]'>
        <div className='container w-full 2xl:w-[80rem] py-13 mx-auto flex flex-col px-3'>
          <p className='text-3xl mb-10 font-semibold text-center'>Các tính năng nổi bật</p>
          <div className='grid max-xl:grid-rows-2 grid-flow-col gap-5'>
            {features.map((f, i) => (
              <FeatureCard key={i} icon={f.icon} title={f.title} description={f.description} />
            ))}
          </div>
        </div>
      </div>

      {/* Decks Section */}
      <div className='container w-full 2xl:w-[80rem] py-15 mx-auto flex flex-col p-3'>
        <p className='font-bold text-3xl mb-5 text-center'>Danh sách bộ thẻ nổi bật</p>
        <div className='w-full grid grid-cols-3 max-xl:grid-cols-2 max-md:grid-cols-1 gap-5'>
          {decks.map((deck, i) => (
            <DeckCard key={i} title={deck.title} count={deck.count} author={deck.author} handleClick={() => {navigate('/learn-lesson')}} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage

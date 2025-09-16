import { Cog8ToothIcon, PhotoIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import Button from '~/components/Button'
import Input from '~/components/Input'
import TextArea from '~/components/TextArea'
import trueFalseScrollY from '~/utils/trueFalseScrollY'

const CreateLessonPage = () => {
  const isScrolled = trueFalseScrollY(50)
  const [description, setDescription] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [listData,setListData]=useState<{
    sourse:string
    target:string
  }>(
    {
      sourse:"",
      target:""
    }
  )
    // hàm cập nhật state cho từng field
  const handleChange = (key: keyof typeof listData, value: string) => {
    setListData((prev) => ({
      ...prev,
      [key]: value
    }))
  }
  return (
    <div className='h-full  max-2xl:px-10'>
      {/* header */}
      <div className=' sticky top-0 z-100 bg-background'>
        <div className='flex items-center justify-between container w-full 2xl:w-[80rem] mx-auto py-2'>
          <p className='text-3xl font-bold my-5'>Tạo bài học mới</p>
          <div className='flex gap-3'>
            <Button variant='secondary' className='px-3 py-2 font-bold' rounded='rounded-2xl '>
              Tạo
            </Button>
            <Button variant='primary' className='px-3 py-2 font-bold ' rounded='rounded-2xl '>
              Tạo và ôn luyện
            </Button>
          </div>
        </div>
        <div className={`border-b border-1 w-full border-gray-400 ${isScrolled ? '' : 'hidden'}`}></div>
      </div>
      <div className='container w-full 2xl:w-[80rem] mx-auto '>
        {/* tiêu đề */}
        <div className='flex flex-col gap-2 mt-5'>
          <Input
            title='Tiêu đề bài học'
            id='title'
            type='text'
            placeholder='Nhập tiêu đề, ví dụ Tiếng anh - Từ mới ngày 1'
            valueInput={title}
            setValueInput={setTitle}
          />
          <TextArea
            placeholder='Nhập mô tả cho bài học.......'
            valueInput={description}
            rows={2}
            setValueInput={setDescription}
          />
        </div>
        {/* add, delete */}
        <div className='flex items-center justify-between mt-5 '>
          <div className='flex gap-3'>
            <Button variant='secondary' className='px-3 py-2 font-bold' rounded='rounded-2xl '>
              + Nhập
            </Button>
            <Button variant='secondary' className='px-3 py-2 font-bold' rounded='rounded-2xl '>
              + Thêm sơ đồ
            </Button>
          </div>
          <div className='flex gap-3'>
            {/* setting */}
            <Button variant='secondary' className='p-2 font-bold' rounded='rounded-[100%] '>
              <Cog8ToothIcon className='size-7' />
            </Button>
            {/* delete */}
            <Button variant='secondary' className='p-2 font-bold' rounded='rounded-[100%] '>
              <TrashIcon className='size-7' />
            </Button>
          </div>
        </div>
        {/* items add */}
        <div className="">
          {/* item */}
          <div className="shadow bg-gray-100 rounded-md p-4">
            {/* top-item */}
            <div className="flex justify-between items-center">
              <p>1</p>
              <span className='border-gray-300 border rounded-4xl p-1 hover:bg-gray-200'>
              <TrashIcon className='size-5'/>
              </span>
            </div>
            {/* main-item */}
            <div className="grid grid-cols-2 gap-5">
              <div className="">
                <TextArea setValueInput={(value)=>{handleChange("sourse",value)}} valueInput={listData.sourse} rows={1}/>
                <p className='text-gray-400 uppercase text-sm font-semibold'>Thuật Ngữ</p>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-5">
                <div className="">
                  <TextArea setValueInput={(value)=>{handleChange("target",value)}} valueInput={listData.target} rows={1}/>
                <p>Định nghĩa</p>
                </div>
                <div className="flex flex-col items-center border-dashed border-gray-300 border-2 rounded-xl justify-center h-17 px-4">
                  <PhotoIcon className='size-6'/>
                  <span className='text-[12px] font-semibold'>Hình ảnh</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CreateLessonPage

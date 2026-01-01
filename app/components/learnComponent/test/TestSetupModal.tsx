import React, { Fragment, use, useEffect, useRef } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import IconButton from '~/components/button/ButtonIcon'
import { ClipboardDocumentCheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Toggle from '~/components/Toggle'
import Button from '~/components/button/Button'

// Props: Các tham số cấu hình modal thiết lập bài kiểm tra
interface Props {
  open: boolean
  onClose: () => void
  batchSize: number | string
  setBatchSize: (n: number | string) => void
  maxCount: number
  isTestTrueFalse: boolean
  setIsTestTrueFalse: (v: boolean) => void
  isTestMultiple: boolean
  setIsTestMultiple: (v: boolean) => void
  isTestEssay: boolean
  setIsTestEssay: (v: boolean) => void
  countEnabled: number
  onStart: () => void
}

// TestSetupModal: Modal cho phép người dùng chọn số câu và bật/tắt các chế độ kiểm tra
const TestSetupModal: React.FC<Props> = ({
  open,
  onClose,
  batchSize,
  setBatchSize,
  maxCount,
  isTestTrueFalse,
  setIsTestTrueFalse,
  isTestMultiple,
  setIsTestMultiple,
  isTestEssay,
  setIsTestEssay,
  countEnabled,
  onStart
}) => {
  console.log('kiểm tra batchSize: ', batchSize)
  const refButtonSetup = useRef<HTMLButtonElement>(null)
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-50'
        onClose={() => {
          onStart()
          onClose()
        }}
      >
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-200'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-150'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-[#0101108f] backdrop-blur-sm ' />
        </TransitionChild>

        <div className='fixed inset-0 flex items-center justify-center'>
          <TransitionChild
            as={Fragment}
            enter='ease-out duration-200'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-150'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <DialogPanel className='w-full max-w-3xl rounded-2xl bg-white px-10 py-8 shadow-xl relative'>
              <div className='absolute top-1 right-3'>
                <IconButton icon={XMarkIcon} onClick={onClose} size={7} variant='secondary' />
              </div>

              <DialogTitle className='mb-4 flex justify-between mt-5 items-center'>
                <div>
                  <p className='font-semibold text-lg'>Thư mục 1</p>
                  <h1 className='font-bold text-3xl'>Thiết lập bài kiểm tra</h1>
                </div> 
                <ClipboardDocumentCheckIcon className='size-13 text-blue-700' />
              </DialogTitle>

              <div className='flex flex-col gap-y-10 mt-7'>
                <div className='flex items-center justify-between'>
                  <p className='font-semibold text-lg'>
                    Câu hỏi <span className='font-light'>{`(tối đa ${maxCount})`}</span>{' '}
                  </p>
                  <input
                    type='number'
                    value={batchSize}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault() 
                        refButtonSetup.current?.focus()
                      }
                    }}
                    onFocus={(e) => {
                      e.target.select()
                    }}
                    onChange={(e) => {
                      const raw = e.target.value

                      if (raw === '') {
                        setBatchSize('')
                        return
                      }

                      let value = Number(raw)

                      if (Number.isNaN(value)) return

                      if (value < 1) value = 1
                      if (value > maxCount) value = maxCount

                      setBatchSize(value)
                    }}
                    onBlur={(e) => {
                      if (e.target.value === '') {
                        setBatchSize(1)
                      }
                    }}
                    className='w-20 px-3 py-3 font-semibold rounded-xl border-none bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300'
                  />
                </div>
                <div className='w-full h-[1px] bg-gray-300'></div>
                <div className='flex items-center justify-between'>
                  <p className='font-semibold text-lg'>Đúng/Sai</p>
                  <Toggle
                    checked={isTestTrueFalse}
                    onChange={() => {
                      if (isTestTrueFalse && countEnabled === 1) return
                      setIsTestTrueFalse(!isTestTrueFalse)
                    }}
                  />
                </div>
                <div className='flex items-center justify-between'>
                  <p className='font-semibold text-lg'>Trắc nghiệm</p>
                  <Toggle
                    checked={isTestMultiple}
                    onChange={() => {
                      if (isTestMultiple && countEnabled === 1) return
                      setIsTestMultiple(!isTestMultiple)
                    }}
                  />
                </div>
                <div className='flex items-center justify-between'>
                  <p className='font-semibold text-lg'>Tự luận</p>
                  <Toggle
                    checked={isTestEssay}
                    onChange={() => {
                      if (isTestEssay && countEnabled === 1) return
                      setIsTestEssay(!isTestEssay)
                    }}
                  />
                </div>
              </div>

              <div className='mt-6 flex justify-end'>
                <Button
                  ref={refButtonSetup}
                  className='px-4 py-2 text-sm font-semibold'
                  onClick={onStart}
                  rounded='rounded-3xl'
                >
                  Bắt đầu làm kiểm tra
                </Button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}

export default TestSetupModal

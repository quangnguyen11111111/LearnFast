import { Fragment } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ModalBlocksGameInstructionsProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function ModalBlocksGameInstructions({ isOpen, setIsOpen }: ModalBlocksGameInstructionsProps) {
  const instructions = [
    {
      title: 'Mục đích',
      description:
        'Xếp các khối (block) lên bảng để hoàn thành các dòng hoặc cột đầy đủ. Khi dòng/cột đầy, chúng sẽ biến mất và mỗi block bạn đặt sẽ giúp bạn ghi điểm.',
      icon: '🎯'
    },
    {
      title: 'Cách chơi',
      description:
        'Chọn các khối đã cho và kéo thả chúng lên bảng chơi. Bạn có 3 khối để lựa chọn mỗi lượt. Sau khi sử dụng hết cả 3 khối bạn sẽ phải trả lời 1 câu hỏi để thêm lượt chơi và 3 khối mới sẽ xuất hiện.',
      icon: '✋'
    },
    {
      title: 'Chiến lược',
      description:
        'Cố gắng tạo thành các dòng hoặc cột hoàn chỉnh để xóa chúng và giải phóng không gian. Lên kế hoạch trước để tránh bảng đầy quá nhanh.',
      icon: '🧠'
    },
    {
      title: 'Kết thúc trò chơi',
      description:
        'Trò chơi sẽ kết thúc khi bảng đầy và bạn không thể đặt khối nào nữa. Cố gắng ghi điểm cao nhất có thể!',
      icon: '⏹️'
    }
  ]

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={() => setIsOpen(false)}>
        {/* Nền mờ */}
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/40' />
        </TransitionChild>

        {/* Modal panel */}
        <div className='fixed inset-0 flex items-center justify-center p-4'>
          <TransitionChild
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <DialogPanel className='w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-xl'>
              {/* Header với nút đóng */}
              <div className='flex items-center justify-between mb-6'>
                <DialogTitle className='text-3xl font-bold text-gray-800'>Cách chơi Blocks</DialogTitle>
                <button onClick={() => setIsOpen(false)} className='p-2 hover:bg-gray-100 rounded-lg transition'>
                  <XMarkIcon className='size-6 text-gray-600' />
                </button>
              </div>

              {/* Nội dung hướng dẫn */}
              <div className='space-y-6'>
                {instructions.map((instruction, index) => (
                  <div
                    key={index}
                    className='flex gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100'
                  >
                    <div className='text-4xl flex-shrink-0 w-12 h-12 flex items-center justify-center'>
                      {instruction.icon}
                    </div>
                    <div className='flex-1'>
                      <h3 className='text-lg font-bold text-gray-800 mb-2'>{instruction.title}</h3>
                      <p className='text-gray-700 leading-relaxed'>{instruction.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mẹo chơi */}
              <div className='mt-8 p-4 rounded-xl bg-amber-50 border border-amber-200'>
                <h4 className='text-lg font-bold text-amber-900 mb-2'>💡 Mẹo chơi</h4>
                <ul className='text-amber-900 space-y-2'>
                  <li>• Ưu tiên hoàn thành dòng/cột để giải phóng không gian</li>
                  <li>• Không đặt khối ở góc nếu không cần thiết</li>
                  <li>• Hãy bình tĩnh và suy nghĩ kỹ trước khi đặt khối</li>
                  <li>• Khối nhỏ rất hữu ích để lấp những chỗ trống</li>
                </ul>
              </div>

              {/* Nút đóng ở dưới */}
              <div className='flex justify-end gap-3 mt-8'>
                <button
                  onClick={() => setIsOpen(false)}
                  className='px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition'
                >
                  Hiểu rồi, chơi thôi!
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}

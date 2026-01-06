import { TrashIcon } from '@heroicons/react/24/outline'
import TextArea from '~/components/input/TextArea'

/* ------------------ LessonItem ------------------ */
export interface LessonItemProps {
  index: number
  source: string
  target: string
  onChange: (index: number, key: 'source' | 'target', value: string) => void
  onDelete: (index: number) => void
}

const LessonItem = ({ index, source, target, onChange, onDelete }: LessonItemProps) => {
  return (
    <div className='shadow bg-gray-100 rounded-md p-4 '>
      {/* top-item */}
      <div className='flex justify-between items-center'>
        <p>{index + 1}</p>
        <span
          onClick={() => onDelete(index)}
          className='border-gray-300 border rounded-4xl p-1 hover:bg-gray-200 cursor-pointer'
        >
          <TrashIcon className='size-5' />
        </span>
      </div>

      {/* main-item */}
      <div className='grid grid-cols-2 max-md:grid-cols-1 gap-5 mt-3'>
        {/* source */}
        <div>
          <TextArea setValueInput={(value) => onChange(index, 'source', value)} valueInput={source} rows={1} />
          <p className='text-gray-400 uppercase text-sm font-semibold'>Thuật Ngữ</p>
        </div>

        {/* target + image */}
        <div className='grid grid-cols-[1fr_auto] gap-5'>
          <div>
            <TextArea setValueInput={(value) => onChange(index, 'target', value)} valueInput={target} rows={1} />
            <p className='text-gray-400 uppercase text-sm font-semibold'>Định nghĩa</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LessonItem

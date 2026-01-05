import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import Button from '../button/Button'
import IconButton from '../button/ButtonIcon'
import { useState } from 'react'
import ModalBlocksGameInstructions from './ModalBlocksGameInstructions'

interface SetUpGameProps {
  handleStartGame: () => void
  img: string | React.ElementType
  title?: string
  content?: string
  instruct?: boolean
  isBlocksGame?: boolean
}
const SetUpGame = ({
  handleStartGame,
  img: Img,
  title,
  content,
  instruct = false,
  isBlocksGame = false
}: SetUpGameProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  return (
    <>
      <div className='flex flex-col gap-3 justify-center items-center h-full'>
        {typeof Img === 'string' ? (
          <img src={Img} alt='' className='size-40 mb-4' />
        ) : (
          <Img className='size-25 text-blue-600' />
        )}
        <h2 className='text-2xl font-bold my-4 '>{title}</h2>
        <p className='max-w-[25rem] text-center'>{content}</p>
        <div className='flex gap-2'>
          {instruct && (
            <Button
              rounded='rounded-3xl'
              className='px-10 py-3 font-semibold mt-2'
              onClick={() => setIsModalOpen(true)}
              variant='secondary'
            >
              <QuestionMarkCircleIcon className='size-5 inline-block ml-2' /> Hướng dẫn chơi
            </Button>
          )}
          <Button rounded='rounded-3xl' className='px-20 py-3 font-semibold mt-2' onClick={handleStartGame}>
            Bắt đầu chơi
          </Button>
        </div>
      </div>
      {isBlocksGame && <ModalBlocksGameInstructions isOpen={isModalOpen} setIsOpen={setIsModalOpen} />}
    </>
  )
}

export default SetUpGame

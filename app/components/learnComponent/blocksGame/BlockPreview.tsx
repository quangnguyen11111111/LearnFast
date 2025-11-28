import React from 'react'
import { type BlockInstance } from '../../../features/blocksGame/types'
import { BOARD_GAP_PX } from '../../../features/blocksGame/constants'

// BlockPreview: Ô block tương tác trong "pool" để người chơi có thể kéo thả
// - onPointerDown: khởi tạo drag khi người chơi nhấn giữ
// - Hiển thị trạng thái dùng rồi (opacity + cursor)
export function BlockPreview({
  block,
  onPointerDown,
  cellSize
}: {
  block: BlockInstance
  onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void
  cellSize: number
}) {
  const innerSize = cellSize - BOARD_GAP_PX
  return (
    <div
      onPointerDown={onPointerDown}
      role='button'
      aria-disabled={block.used}
      className={`relative touch-none select-none rounded-2xl bg-transparent p-3 transition ${
        block.used ? 'cursor-not-allowed opacity-30' : 'cursor-grab active:cursor-grabbing'
      }`}
      style={{ width: block.width * cellSize + BOARD_GAP_PX, height: block.height * cellSize + BOARD_GAP_PX }}
    >
      {block.cells.map((cell, index) => (
        <div
          key={`${block.id}-${index}`}
          className='absolute rounded-xl shadow'
          style={{
            width: innerSize,
            height: innerSize,
            left: cell.col * cellSize + BOARD_GAP_PX / 2,
            top: cell.row * cellSize + BOARD_GAP_PX / 2,
            backgroundColor: block.color
          }}
        />
      ))}
    </div>
  )
}

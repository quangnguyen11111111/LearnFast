import React from 'react'
import { type BlockInstance } from '../../../features/blocksGame/types'
import { BOARD_GAP_PX } from '../../../features/blocksGame/constants'

export function BlockGhost({ block, cellSize }: { block: BlockInstance; cellSize: number }) {
  const effectiveCell = cellSize || 40
  const innerSize = effectiveCell - BOARD_GAP_PX
  return (
    <div
      className='relative rounded-2xl bg-transparent p-3'
      style={{ width: block.width * effectiveCell + BOARD_GAP_PX, height: block.height * effectiveCell + BOARD_GAP_PX }}
    >
      {block.cells.map((cell, index) => (
        <div
          key={`${block.id}-ghost-${index}`}
          className='absolute rounded-xl'
          style={{
            width: innerSize,
            height: innerSize,
            left: cell.col * effectiveCell + BOARD_GAP_PX / 2,
            top: cell.row * effectiveCell + BOARD_GAP_PX / 2,
            backgroundColor: block.color,
            opacity: 0.85
          }}
        />
      ))}
    </div>
  )
}

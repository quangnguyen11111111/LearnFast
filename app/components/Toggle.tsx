import React from 'react'

interface ToggleProps {
  checked: boolean
  onChange: () => void
}

const Toggle = ({ checked, onChange }: ToggleProps) => {
  return (
    <div
      onClick={onChange}
      className={`
        w-10 h-5 flex items-center rounded-full cursor-pointer p-1
        transition-all duration-300
        ${checked ? 'bg-blue-400' : 'bg-gray-400'}
      `}
    >
      <div
        className={`
          w-4 h-4 bg-white rounded-full shadow-md transform
          transition-all duration-300
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
      ></div>
    </div>
  )
}

export default Toggle

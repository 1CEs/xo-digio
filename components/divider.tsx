import React from 'react'

type Props = {
    children: React.ReactNode
}

const Divider = ({ children }: Props) => {
  return (
    <div className="flex items-center gap-2 w-full">
        <div className="flex-1 h-px bg-gray-200 w-full"></div>
        {children}
        <div className="flex-1 h-px bg-gray-200 w-full"></div>
    </div>
  )
}

export default Divider

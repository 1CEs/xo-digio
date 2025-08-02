import React from 'react'

type Props = {
  children: React.ReactNode
}

const layout = ({ children }: Props) => {
  return (
    <div 
      className="min-h-screen bg-grid-pattern bg-grid-size relative w-full h-full flex items-center justify-center"
      >
      {children}
    </div>
  )
}

export default layout
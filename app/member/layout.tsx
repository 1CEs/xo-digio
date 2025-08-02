import React from 'react'

type Props = {
  children: React.ReactNode
}

const layout = ({ children }: Props) => {
  return (
    <div 
      className="min-h-screen bg-grid-pattern bg-grid-size relative w-full h-full flex items-center justify-center"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '200px 200px'
      }}
      >
      {children}
    </div>
  )
}

export default layout
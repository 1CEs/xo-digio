import React from 'react'
import { FaCircleO, IcomoonFreeCross } from './icons'

type Props = {
    size: "sm" | "md" | "lg" | "xl"
    idle?: boolean
    rows?: number
    cols?: number
} & React.HTMLAttributes<HTMLDivElement>

const Board = ({ size="md", idle=false, rows=3,cols=3, ...props }: Props) => {
    const idlePattern = [
        <FaCircleO/>, <IcomoonFreeCross/>, "",
        "", <IcomoonFreeCross/>, <FaCircleO/>,
        <FaCircleO/>, "", <IcomoonFreeCross/>
    ]
    const sizeClasses = {
        sm: "w-24 h-24",
        md: "w-48 h-48",
        lg: "w-72 h-72",
        xl: "w-96 h-96",
    }[size]
  return (
    <div 
        className={`${props.className} ${sizeClasses} grid grid-cols-${cols} grid-rows-${rows} gap-2 ${idle ? "idle-board" : ""}`} {...props}
    >
        {Array.from({ length: rows * cols }, (_, index) => {
            const colors = [
                'bg-primary ',
                'bg-secondary ', 
                'bg-success ',
                'bg-warning ',
                'bg-danger ',
                'bg-foreground '
            ]
            const colorClass = colors[index % colors.length]
            
            return (
                <div 
                    key={index} 
                    className={`${colorClass} rounded-2xl p-1 w-full text-8xl text-black flex items-center justify-center text-center font-bold ${idle ? "idle-cell" : ""}`}
                >
                    {idle ? idlePattern[index] : ""}
                </div>
            )
        })}
    </div>
  )
}

export default Board
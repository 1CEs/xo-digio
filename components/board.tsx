import React from 'react'
import { FaCircleO, IcomoonFreeCross } from './icons'

type Player = 'X' | 'O'
type CellValue = Player | null
type GameStatus = 'playing' | 'finished' | 'draw'

type Props = {
    size: "sm" | "md" | "lg" | "xl"
    idle?: boolean
    rows?: number
    cols?: number
    board?: CellValue[][]
    onCellClick?: (row: number, col: number) => void
    currentPlayer?: Player
    gameStatus?: GameStatus
    winningLine?: Array<{row: number, col: number}> | null
} & React.HTMLAttributes<HTMLDivElement>

const Board = ({ 
    size="md", 
    idle=false, 
    rows=3, 
    cols=3, 
    board, 
    onCellClick, 
    currentPlayer, 
    gameStatus,
    winningLine,
    ...props 
}: Props) => {
    const idlePattern = [
        <FaCircleO key="o1"/>, <IcomoonFreeCross key="x1"/>, "",
        "", <IcomoonFreeCross key="x2"/>, <FaCircleO key="o2"/>,
        <FaCircleO key="o3"/>, "", <IcomoonFreeCross key="x3"/>
    ]
    
    // Calculate responsive board and cell sizes based on grid dimensions
    const baseSizes = {
        sm: 120,  // Smaller base for compact boards
        md: 240,  // Medium base size
        lg: 360,  // Large base size
        xl: 480,  // Extra large base size
    }
    
    const baseSize = baseSizes[size]
    const maxDimension = Math.max(rows, cols)
    
    // Calculate cell size based on board size and grid dimensions
    const cellSize = Math.floor(baseSize / maxDimension)
    const boardSize = cellSize * maxDimension
    
    // Ensure minimum cell size for usability
    const minCellSize = 32 // minimum 32px
    const finalCellSize = Math.max(cellSize, minCellSize)
    const finalBoardSize = finalCellSize * maxDimension
    
    const boardStyle = {
        width: `${finalBoardSize}px`,
        height: `${finalBoardSize}px`,
    }
    
    const cellStyle = {
        width: `${finalCellSize}px`,
        height: `${finalCellSize}px`,
    }
    
    const getCellIcon = (value: CellValue) => {
        if (value === 'X') {
            return <IcomoonFreeCross fontSize={size === 'xl' ? 80 : size === 'lg' ? 60 : size === 'md' ? 40 : 24} />
        }
        if (value === 'O') {
            return <FaCircleO fontSize={size === 'xl' ? 80 : size === 'lg' ? 60 : size === 'md' ? 40 : 24} />
        }
        return null
    }
    
    const handleCellClick = (row: number, col: number) => {
        if (onCellClick && !idle && gameStatus === 'playing') {
            onCellClick(row, col)
        }
    }
    
    const isWinningCell = (row: number, col: number) => {
        return winningLine?.some(cell => cell.row === row && cell.col === col) || false
    }
    
    const getWinningCellColor = (cellValue: CellValue) => {
        if (cellValue === 'X') {
            return 'bg-primary/20 border-primary border-2'
        }
        if (cellValue === 'O') {
            return 'bg-secondary/20 border-secondary border-2'
        }
        return ''
    }
    
    return (
        <div 
            className={`${props.className} w-[fit-content!important] grid gap-2 ${idle ? "idle-board" : ""}`} 
            style={{
                ...boardStyle,
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`
            }}
            {...props}
        >
            {Array.from({ length: rows }, (_, rowIndex) =>
                Array.from({ length: cols }, (_, colIndex) => {
                    const index = rowIndex * cols + colIndex
                    const colors = [
                        'bg-gray-100',
                        'bg-gray-200', 
                        'bg-gray-300'
                    ]
                    const colorClass = colors[index % colors.length]
                    
                    const cellValue = board ? board[rowIndex][colIndex] : null
                    const isClickable = !idle && onCellClick && !cellValue && gameStatus === 'playing'
                    const isWinning = isWinningCell(rowIndex, colIndex)
                    const winningCellStyle = isWinning ? getWinningCellColor(cellValue) : ''
                    
                    return (
                        <div 
                            key={`${rowIndex}-${colIndex}`} 
                            className={`
                                ${isWinning ? winningCellStyle : `${colorClass} border border-gray-400`} 
                                rounded-lg
                                flex items-center justify-center text-center font-bold
                                ${idle ? "idle-cell" : ""}
                                ${isClickable ? "cursor-pointer hover:bg-gray-50 transition-colors" : ""}
                                ${cellValue ? "text-gray-800" : ""}
                                ${isWinning ? "animate-pulse" : ""}
                            `}
                            style={cellStyle}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                        >
                            {idle ? idlePattern[index] : getCellIcon(cellValue)}
                        </div>
                    )
                })
            ).flat()}
        </div>
    )
}

export default Board
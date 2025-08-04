"use client"

import { useState, useEffect } from "react"
import PlayfulButton from "@/components/playful-button"
import { FluentBot16Filled, IconParkSolidSettingTwo, MaterialSymbolsHistory, MingcutePlayFill, SolarRestart2Bold, SolarHomeBold } from "@/components/icons"
import Board from "@/components/board"
import CustomizeModal from "@/components/modals/customize-modal"
import ProfileCard from "@/components/profile-card"
import { useSettingStore } from "@/stores/setting"
import { useAuthStore } from "@/stores/auth"
import { z } from "zod"
import { customizationSchema } from "@/validation/setting"

type CustomizationFormData = z.infer<typeof customizationSchema>

type GameMode = 'menu' | 'vs-friend' | 'vs-bot'
type GameStatus = 'playing' | 'finished' | 'draw'
type Player = 'X' | 'O'
type CellValue = Player | null

interface GameState {
  board: CellValue[][]
  currentPlayer: Player
  status: GameStatus
  winner: Player | null
  mode: GameMode
  winningLine: Array<{row: number, col: number}> | null
}

const MenuButtons = ({ onCustomizeClick, onStartGame }: { 
  onCustomizeClick: () => void
  onStartGame: (mode: 'vs-friend' | 'vs-bot') => void 
}) => {
    return (
        <div className="flex flex-col gap-4 items-center justify-center">
            <PlayfulButton 
                className="w-full" 
                startIcon={<MingcutePlayFill fontSize={32}/>} 
                size="lg" 
                variant="primary"
                onClick={() => onStartGame('vs-friend')}
            >
                VS FRIEND
            </PlayfulButton>
            <PlayfulButton 
                className="w-fit" 
                startIcon={<FluentBot16Filled fontSize={32}/> } 
                size="lg" 
                variant="secondary"
                onClick={() => onStartGame('vs-bot')}
            >
                VS BOT
            </PlayfulButton>
            <PlayfulButton className="w-fit" startIcon={<MaterialSymbolsHistory fontSize={24}/> } size="md" variant="success">
                HISTORY
            </PlayfulButton>
            <PlayfulButton 
                className="w-full" 
                startIcon={<IconParkSolidSettingTwo fontSize={24}/> } 
                size="md" 
                variant="warning"
                onClick={onCustomizeClick}
            >
                CUSTOMIZATION
            </PlayfulButton>
        </div>
    )
}

const GameControls = ({ 
  gameState, 
  onRestart, 
  onBackToMenu 
}: { 
  gameState: GameState
  onRestart: () => void
  onBackToMenu: () => void 
}) => {
    const getStatusMessage = () => {
        if (gameState.status === 'finished') {
            return gameState.winner ? `Player ${gameState.winner} Wins!` : 'Game Over'
        }
        if (gameState.status === 'draw') {
            return "It's a Draw!"
        }
        return `Player ${gameState.currentPlayer}'s Turn`
    }

    const getStatusColor = () => {
        if (gameState.status === 'finished') {
            return gameState.winner === 'X' ? 'text-primary' : 'text-secondary'
        }
        if (gameState.status === 'draw') {
            return 'text-warning'
        }
        return gameState.currentPlayer === 'X' ? 'text-primary' : 'text-secondary'
    }

    return (
        <div className="flex flex-col gap-4 items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">
                    {gameState.mode === 'vs-friend' ? 'VS Friend' : 'VS Bot'}
                </h2>
                <div className={`text-xl font-semibold ${getStatusColor()}`}>
                    {getStatusMessage()}
                </div>
            </div>
            
            <div className="flex gap-3">
                <PlayfulButton 
                    startIcon={<SolarRestart2Bold fontSize={20}/>} 
                    size="md" 
                    variant="warning"
                    onClick={onRestart}
                >
                    RESTART
                </PlayfulButton>
                <PlayfulButton 
                    startIcon={<SolarHomeBold fontSize={20}/>} 
                    size="md" 
                    variant="secondary"
                    onClick={onBackToMenu}
                >
                    MENU
                </PlayfulButton>
            </div>
        </div>
    )
}

function PlayPage() {
    const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false)
    const [gameState, setGameState] = useState<GameState>({
        board: [],
        currentPlayer: 'X',
        status: 'playing',
        winner: null,
        mode: 'menu',
        winningLine: null
    })
    
    const { boardRows, boardCols, aiDifficulty, getSettings } = useSettingStore()
    const { role, isAuthenticated } = useAuthStore()

    const initializeBoard = (): CellValue[][] => {
        return Array(boardRows).fill(null).map(() => Array(boardCols).fill(null))
    }

    const checkWinner = (board: CellValue[][]): { winner: Player | null, winningLine: Array<{row: number, col: number}> | null } => {
        const rows = board.length
        const cols = board[0].length
        const winCondition = Math.min(rows, cols, 5)

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const player = board[row][col]
                if (!player) continue

                const directions = [
                    [0, 1],   
                    [1, 0],   
                    [1, 1],   
                    [1, -1]   
                ]

                for (const [dRow, dCol] of directions) {
                    const winningCells: Array<{row: number, col: number}> = [{row, col}]
                    
                    for (let i = 1; i < winCondition; i++) {
                        const newRow = row + i * dRow
                        const newCol = col + i * dCol
                        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && 
                            board[newRow][newCol] === player) {
                            winningCells.push({row: newRow, col: newCol})
                        } else {
                            break
                        }
                    }
                    
                    for (let i = 1; i < winCondition; i++) {
                        const newRow = row - i * dRow
                        const newCol = col - i * dCol
                        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && 
                            board[newRow][newCol] === player) {
                            winningCells.unshift({row: newRow, col: newCol})
                        } else {
                            break
                        }
                    }
                    
                    if (winningCells.length >= winCondition) {
                        return { winner: player, winningLine: winningCells }
                    }
                }
            }
        }
        return { winner: null, winningLine: null }
    }

    const isBoardFull = (board: CellValue[][]): boolean => {
        return board.every(row => row.every(cell => cell !== null))
    }

    const handleCellClick = (row: number, col: number) => {
        if (gameState.mode === 'menu' || gameState.status !== 'playing' || gameState.board[row][col]) {
            return
        }

        const newBoard = gameState.board.map(r => [...r])
        newBoard[row][col] = gameState.currentPlayer

        const result = checkWinner(newBoard)
        const isFull = isBoardFull(newBoard)
        
        setGameState(prev => ({
            ...prev,
            board: newBoard,
            currentPlayer: prev.currentPlayer === 'X' ? 'O' : 'X',
            status: result.winner ? 'finished' : isFull ? 'draw' : 'playing',
            winner: result.winner,
            winningLine: result.winningLine
        }))

        if (!result.winner && !isFull && gameState.mode === 'vs-bot' && gameState.currentPlayer === 'X') {
            setTimeout(() => makeBotMove(newBoard), 500)
        }
    }

    const makeBotMove = (board: CellValue[][]) => {
        const emptyCells: [number, number][] = []
        
        for (let row = 0; row < boardRows; row++) {
            for (let col = 0; col < boardCols; col++) {
                if (!board[row][col]) {
                    emptyCells.push([row, col])
                }
            }
        }

        if (emptyCells.length === 0) return

        const [botRow, botCol] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
        const newBoard = board.map(r => [...r])
        newBoard[botRow][botCol] = 'O'

        const result = checkWinner(newBoard)
        const isFull = isBoardFull(newBoard)
        
        setGameState(prev => ({
            ...prev,
            board: newBoard,
            currentPlayer: 'X',
            status: result.winner ? 'finished' : isFull ? 'draw' : 'playing',
            winner: result.winner,
            winningLine: result.winningLine
        }))
    }

    const handleStartGame = (mode: 'vs-friend' | 'vs-bot') => {
        setGameState({
            board: initializeBoard(),
            currentPlayer: 'X',
            status: 'playing',
            winner: null,
            winningLine: null,
            mode
        })
    }

    const handleRestart = () => {
        setGameState(prev => ({
            ...prev,
            board: initializeBoard(),
            currentPlayer: 'X',
            status: 'playing',
            winner: null,
            winningLine: null
        }))
    }

    const handleBackToMenu = () => {
        setGameState(prev => ({
            ...prev,
            mode: 'menu'
        }))
    }

    const handleCustomizeClick = () => {
        setIsCustomizeModalOpen(true)
    }

    const handleCustomizeSave = (data: CustomizationFormData) => {
        console.log('Game settings updated:', data)
        if (gameState.mode !== 'menu') {
            handleBackToMenu()
        }
    }

    const handleCustomizeClose = () => {
        setIsCustomizeModalOpen(false)
    }

    if (gameState.mode === 'menu') {
        return (
            <>
                <div className="flex h-full w-full items-center justify-center gap-8 flex-wrap">
                    <Board size="xl" idle rows={boardRows} cols={boardCols} />
                    <div className="flex flex-col gap-4 items-center justify-center">
                        <div className="flex flex-col gap-2 items-center justify-center pb-6">
                            <h1 className="text-3xl font-bold text-center">Play Tic Tac Toe</h1>
                            <h1 className="text-3xl font-bold text-center">With Your Friends</h1>
                            <div className="text-sm mt-2">
                                Board: {boardRows}×{boardCols} | AI: {aiDifficulty}
                            </div>
                        </div>
                        <MenuButtons onCustomizeClick={handleCustomizeClick} onStartGame={handleStartGame} />
                    </div>
                    <div className="flex flex-col gap-4">
                        <ProfileCard className="w-64" />
                    </div>
                </div>
                
                <CustomizeModal 
                    isOpen={isCustomizeModalOpen}
                    onClose={handleCustomizeClose}
                    onSave={handleCustomizeSave}
                    initialValues={getSettings()}
                />
            </>
        )
    }
    return (
        <>
            <div className="flex h-full w-full items-center justify-center gap-8 flex-wrap">
                <div className="flex flex-col w-fit items-center justify-center gap-4">
                    <GameControls 
                        gameState={gameState}
                        onRestart={handleRestart}
                        onBackToMenu={handleBackToMenu}
                    />
                    <Board 
                        size="lg" 
                        rows={boardRows} 
                        cols={boardCols}
                        board={gameState.board}
                        onCellClick={handleCellClick}
                        currentPlayer={gameState.currentPlayer}
                        gameStatus={gameState.status}
                        winningLine={gameState.winningLine}
                    />
                    <div className="w-full flex items-center justify-center pt-4">
                        <ProfileCard />
                    </div>
                </div>
            </div>
            
            <CustomizeModal 
                isOpen={isCustomizeModalOpen}
                onClose={handleCustomizeClose}
                onSave={handleCustomizeSave}
                initialValues={getSettings()}
            />
        </>
    )
}

export default PlayPage

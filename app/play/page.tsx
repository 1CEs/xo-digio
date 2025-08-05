"use client"

import { useState, useEffect } from "react"
import PlayfulButton from "@/components/playful-button"
import { FluentBot16Filled, IconParkSolidSettingTwo, MaterialSymbolsHistory, MingcutePlayFill, SolarRestart2Bold, SolarHomeBold } from "@/components/icons"
import Board from "@/components/board"
import CustomizeModal from "@/components/modals/customize-modal"
import HistoryModal from "@/components/modals/history-modal"
import ProfileCard from "@/components/profile-card"
import { useSettingStore } from "@/stores/setting"
import { useAuthStore } from "@/stores/auth"
import { useHistoryStore } from "@/stores/history"
import { z } from "zod"
import { customizationSchema } from "@/validation/setting"
import { IMove, IGameSetting } from "@/database/schema/user.interface"
import MoveTracker from "@/components/move-tracker"

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
    winningLine: Array<{ row: number, col: number }> | null
    moves: IMove[]
    gameStartTime: Date | null
}

const MenuButtons = ({ onCustomizeClick, onStartGame, onHistoryClick, isAuthenticated }: {
    onCustomizeClick: () => void
    onStartGame: (mode: 'vs-friend' | 'vs-bot') => void
    onHistoryClick: () => void
    isAuthenticated: boolean
}) => {
    return (
        <div className="flex flex-col gap-4 items-center justify-center">
            <PlayfulButton
                className="w-full"
                startIcon={<MingcutePlayFill fontSize={32} />}
                size="lg"
                variant="primary"
                onClick={() => onStartGame('vs-friend')}
            >
                VS FRIEND
            </PlayfulButton>
            <PlayfulButton
                className="w-fit"
                startIcon={<FluentBot16Filled fontSize={32} />}
                size="lg"
                variant="secondary"
                onClick={() => onStartGame('vs-bot')}
            >
                VS BOT
            </PlayfulButton>
            <PlayfulButton
                className="w-fit"
                startIcon={<MaterialSymbolsHistory fontSize={24} />}
                size="md"
                variant={isAuthenticated ? "success" : "secondary"}
                onClick={onHistoryClick}
                disabled={!isAuthenticated}
            >
                HISTORY {!isAuthenticated && "(Sign in required)"}
            </PlayfulButton>
            <PlayfulButton
                className="w-full"
                startIcon={<IconParkSolidSettingTwo fontSize={24} />}
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
                    startIcon={<SolarRestart2Bold fontSize={20} />}
                    size="md"
                    variant="warning"
                    onClick={onRestart}
                >
                    RESTART
                </PlayfulButton>
                <PlayfulButton
                    startIcon={<SolarHomeBold fontSize={20} />}
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
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
    const [gameState, setGameState] = useState<GameState>({
        board: [],
        currentPlayer: 'X',
        status: 'playing',
        winner: null,
        mode: 'menu',
        winningLine: null,
        moves: [],
        gameStartTime: null
    })

    const { boardRows, boardCols, aiDifficulty, getSettings } = useSettingStore()
    const { user, isAuthenticated } = useAuthStore()
    const { saveGame } = useHistoryStore()

    const initializeBoard = (): CellValue[][] => {
        return Array(boardRows).fill(null).map(() => Array(boardCols).fill(null))
    }

    const checkWinner = (board: CellValue[][]): { winner: Player | null, winningLine: Array<{ row: number, col: number }> | null } => {
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
                    const winningCells: Array<{ row: number, col: number }> = [{ row, col }]

                    for (let i = 1; i < winCondition; i++) {
                        const newRow = row + i * dRow
                        const newCol = col + i * dCol
                        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols &&
                            board[newRow][newCol] === player) {
                            winningCells.push({ row: newRow, col: newCol })
                        } else {
                            break
                        }
                    }

                    for (let i = 1; i < winCondition; i++) {
                        const newRow = row - i * dRow
                        const newCol = col - i * dCol
                        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols &&
                            board[newRow][newCol] === player) {
                            winningCells.unshift({ row: newRow, col: newCol })
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
        if (gameState.status !== 'playing' || gameState.board[row][col] !== null) {
            return
        }

        const newBoard = gameState.board.map(r => [...r])
        newBoard[row][col] = gameState.currentPlayer

        const result = checkWinner(newBoard)
        const isFull = isBoardFull(newBoard)
        const nextPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X'

        const newMove: IMove = {
            playerId: gameState.currentPlayer === 'X' ? 'st' : 'nd',
            symbol: gameState.currentPlayer,
            position: { row, col },
            timestamp: new Date(),
            moveNumber: gameState.moves.length + 1
        }

        const newMoves = [...gameState.moves, newMove]
        const newStatus = result.winner ? 'finished' : isFull ? 'draw' : 'playing'

        setGameState(prev => ({
            ...prev,
            board: newBoard,
            currentPlayer: nextPlayer,
            status: newStatus,
            winner: result.winner,
            winningLine: result.winningLine,
            moves: newMoves
        }))

        if (newStatus !== 'playing') {
            saveGameToHistory(newMoves, newStatus, result.winner)
        }

        if (gameState.mode === 'vs-bot' && !result.winner && !isFull && nextPlayer === 'O') {
            setTimeout(() => makeBotMove(newBoard, newMoves), 500)
        }
    }

    const makeBotMove = (board: CellValue[][], currentMoves: IMove[]) => {
        const emptyCells: Array<{ row: number, col: number }> = []

        for (let row = 0; row < boardRows; row++) {
            for (let col = 0; col < boardCols; col++) {
                if (board[row][col] === null) {
                    emptyCells.push({ row, col })
                }
            }
        }

        if (emptyCells.length === 0) return

        const randomIndex = Math.floor(Math.random() * emptyCells.length)
        const { row, col } = emptyCells[randomIndex]

        const newBoard = board.map(r => [...r])
        newBoard[row][col] = 'O'

        const result = checkWinner(newBoard)
        const isFull = isBoardFull(newBoard)

        const botMove: IMove = {
            playerId: 'bot',
            symbol: 'O',
            position: { row, col },
            timestamp: new Date(),
            moveNumber: currentMoves.length + 1
        }

        const newMoves = [...currentMoves, botMove]
        const newStatus = result.winner ? 'finished' : isFull ? 'draw' : 'playing'

        setGameState(prev => ({
            ...prev,
            board: newBoard,
            currentPlayer: 'X',
            status: newStatus,
            winner: result.winner,
            winningLine: result.winningLine,
            moves: newMoves
        }))

        if (newStatus !== 'playing') {
            saveGameToHistory(newMoves, newStatus, result.winner)
        }
    }

    const handleStartGame = (mode: 'vs-friend' | 'vs-bot') => {
        setGameState({
            board: initializeBoard(),
            currentPlayer: 'X',
            status: 'playing',
            winner: null,
            winningLine: null,
            mode,
            moves: [],
            gameStartTime: new Date()
        })
    }

    const handleRestart = () => {
        setGameState(prev => ({
            ...prev,
            board: initializeBoard(),
            currentPlayer: 'X',
            status: 'playing',
            winner: null,
            winningLine: null,
            moves: [],
            gameStartTime: new Date()
        }))
    }

    const handleBackToMenu = () => {
        setGameState(prev => ({
            ...prev,
            mode: 'menu',
            moves: [],
            gameStartTime: null
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

    const handleHistoryClick = () => {
        if (!isAuthenticated) {
            alert('Please sign in to view your game history')
            return
        }
        setIsHistoryModalOpen(true)
    }

    const handleHistoryClose = () => {
        setIsHistoryModalOpen(false)
    }

    const saveGameToHistory = async (moves: IMove[], status: GameStatus, winner: Player | null) => {
        if (!user || !isAuthenticated) {
            console.log('Game not saved - user not authenticated')
            return
        }

        const gameData = {
            gameStatus: status === 'draw' ? 'completed' as const : 'completed' as const,
            winner: status === 'draw' ? 'draw' as const :
                winner === 'X' ? 'st' as const :
                    winner === 'O' && gameState.mode === 'vs-bot' ? 'bot' as const :
                        winner === 'O' ? 'nd' as const : null,
            gameSetting: {
                duration: gameState.gameStartTime ? Math.floor((Date.now() - gameState.gameStartTime.getTime()) / 1000) : 0,
                boardRows,
                boardCols,
                aiDifficulty
            } as IGameSetting,
            moves
        }

        try {
            await saveGame(gameData)
            console.log('Game saved successfully')
        } catch (error) {
            console.error('Failed to save game:', error)
        }
    }

    if (gameState.mode === 'menu') {
        return (
            <>
                <div className="flex h-fit w-full items-center justify-center gap-8 flex-wrap">
                    <Board size="xl" idle rows={boardRows} cols={boardCols} />
                    <div className="flex flex-col gap-4 items-center justify-center">
                        <div className="flex flex-col gap-2 items-center justify-center pb-6">
                            <h1 className="text-3xl font-bold text-center">Play Tic Tac Toe</h1>
                            <h1 className="text-3xl font-bold text-center">With Your Friends</h1>
                            <div className="text-sm mt-2">
                                Board: {boardRows}×{boardCols} | AI: {aiDifficulty}
                            </div>
                        </div>
                        <MenuButtons
                            onCustomizeClick={handleCustomizeClick}
                            onStartGame={handleStartGame}
                            onHistoryClick={handleHistoryClick}
                            isAuthenticated={isAuthenticated}
                        />
                        <div className="flex flex-col gap-4">
                            <ProfileCard className="w-64" />
                        </div>
                    </div>

                </div>

                <CustomizeModal
                    isOpen={isCustomizeModalOpen}
                    onClose={handleCustomizeClose}
                    onSave={handleCustomizeSave}
                    initialValues={getSettings()}
                />

                <HistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={handleHistoryClose}
                />
            </>
        )
    }
    return (
        <>
            <div className="flex h-fit w-full items-start justify-center gap-8 flex-wrap p-4">
                {/* Game Board Section */}
                <div className="flex flex-col items-center justify-center gap-4 flex-shrink-0">
                    <GameControls
                        gameState={gameState}
                        onRestart={handleRestart}
                        onBackToMenu={handleBackToMenu}
                    />

                    <div className="flex items-center justify-center">
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
                    </div>
                </div>

                {/* Profile and Move Tracker Section */}
                <div className="flex flex-col items-start justify-center gap-4 flex-shrink-0 mt-16">
                    <ProfileCard />
                    <MoveTracker 
                        moves={gameState.moves}
                        currentPlayer={gameState.currentPlayer}
                        gameMode={gameState.mode as 'vs-friend' | 'vs-bot'}
                        className="w-64"
                    />
                </div>
            </div>

            <CustomizeModal
                isOpen={isCustomizeModalOpen}
                onClose={handleCustomizeClose}
                onSave={handleCustomizeSave}
                initialValues={getSettings()}
            />

            <HistoryModal
                isOpen={isHistoryModalOpen}
                onClose={handleHistoryClose}
            />
        </>
    )
}

export default PlayPage

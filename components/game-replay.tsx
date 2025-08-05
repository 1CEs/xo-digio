import { useState, useEffect } from 'react'
import { useHistoryStore } from '@/stores/history'
import PlayfulButton from './playful-button'
import Board from './board'
import { 
    SolarPlayBold, 
    SolarPauseBold, 
    SolarRestart2Bold, 
    SolarArrowLeftBold, 
    SolarArrowRightBold,
    SolarHomeBold,
    SolarSpeedometer2Bold
} from './icons'
import { IHistory, IMove } from '@/database/schema/user.interface'

interface GameReplayProps {
    history: IHistory
    onClose: () => void
}

type CellValue = 'X' | 'O' | null
type Player = 'X' | 'O'

const GameReplay = ({ history, onClose }: GameReplayProps) => {
    const { replayStep, setReplayStep, stopReplay, startReplay } = useHistoryStore()
    const [isPlaying, setIsPlaying] = useState(false)
    const [playbackSpeed, setPlaybackSpeed] = useState(1000)
    
    const { boardRows, boardCols } = history.gameSetting
    const totalMoves = history.moves.length
    
    useEffect(() => {
        startReplay(history)
        return () => {
            stopReplay()
        }
    }, [history, startReplay, stopReplay])

    const initializeBoard = (): CellValue[][] => {
        return Array(boardRows).fill(null).map(() => Array(boardCols).fill(null))
    }

    const getBoardAtStep = (step: number): CellValue[][] => {
        const board = initializeBoard()
        const movesToApply = history.moves.slice(0, step)
        
        movesToApply.forEach((move) => {
            board[move.position.row][move.position.col] = move.symbol
        })
        
        return board
    }

    const getCurrentPlayer = (): Player => {
        return replayStep % 2 === 0 ? 'X' : 'O'
    }

    const getWinningLine = (step: number) => {
        if (step < totalMoves) return null
        
        const board = getBoardAtStep(step)
        return checkWinner(board).winningLine
    }

    const checkWinner = (board: CellValue[][]) => {
        const maxInRow = Math.min(5, Math.max(boardRows, boardCols))
        
        for (let row = 0; row < boardRows; row++) {
            for (let col = 0; col < boardCols; col++) {
                const cell = board[row][col]
                if (!cell) continue

                const directions = [
                    [0, 1], [1, 0], [1, 1], [1, -1]
                ]

                for (const [dRow, dCol] of directions) {
                    const line = []
                    for (let i = 0; i < maxInRow; i++) {
                        const newRow = row + i * dRow
                        const newCol = col + i * dCol
                        
                        if (newRow >= 0 && newRow < boardRows && 
                            newCol >= 0 && newCol < boardCols && 
                            board[newRow][newCol] === cell) {
                            line.push({ row: newRow, col: newCol })
                        } else {
                            break
                        }
                    }
                    
                    if (line.length >= maxInRow) {
                        return { winner: cell, winningLine: line }
                    }
                }
            }
        }
        
        return { winner: null, winningLine: null }
    }

    useEffect(() => {
        let interval: NodeJS.Timeout
        
        if (isPlaying && replayStep < totalMoves) {
            interval = setInterval(() => {
                setReplayStep(replayStep + 1)
            }, playbackSpeed)
        } else if (replayStep >= totalMoves && isPlaying) {
            setIsPlaying(false)
        }
        
        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }
    }, [isPlaying, replayStep, totalMoves, playbackSpeed, setReplayStep])

    const handlePlayPause = () => {
        if (replayStep >= totalMoves) {
            setReplayStep(0)
            setIsPlaying(true)
        } else {
            setIsPlaying(!isPlaying)
        }
    }

    const handleRestart = () => {
        setIsPlaying(false)
        setReplayStep(0)
    }

    const handlePrevious = () => {
        setIsPlaying(false)
        setReplayStep(Math.max(0, replayStep - 1))
    }

    const handleNext = () => {
        setIsPlaying(false)
        setReplayStep(Math.min(totalMoves, replayStep + 1))
    }

    const handleSpeedChange = () => {
        const speeds = [2000, 1000, 500, 250]
        const currentIndex = speeds.indexOf(playbackSpeed)
        const nextIndex = (currentIndex + 1) % speeds.length
        setPlaybackSpeed(speeds[nextIndex])
    }

    const getSpeedLabel = () => {
        switch (playbackSpeed) {
            case 2000: return '0.5x'
            case 1000: return '1x'
            case 500: return '2x'
            case 250: return '4x'
            default: return '1x'
        }
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getWinnerDisplay = () => {
        if (history.gameStatus === 'abandoned') return 'Abandoned'
        if (!history.winner && history.gameStatus === 'in_progress') return 'In Progress'
        if (history.winner === 'draw') return 'Draw'
        
        switch (history.winner) {
            case 'st': return 'Player X Won'
            case 'nd': return 'Player O Won'
            case 'bot': return 'Bot Won'
            default: return history.winner || 'Draw'
        }
    }

    const currentBoard = getBoardAtStep(replayStep)
    const winningLine = getWinningLine(replayStep)
    const gameStatus = replayStep >= totalMoves && history.gameStatus === 'completed' ? 'finished' : 'playing'

    return (
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-3 sm:p-4 lg:p-6 w-full max-w-xs sm:max-w-sm md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
                <div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Game Replay</h2>
                    <p className="text-gray-400 text-xs sm:text-sm">{formatDate(history.createdAt)}</p>
                </div>
                <PlayfulButton variant="danger" onClick={onClose} size="md">
                    <span className="hidden sm:inline">Close</span>
                </PlayfulButton>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-8 items-start h-full overflow-hidden">
                <div className="flex-1 flex flex-col items-center min-h-0 gap-y-4">
                    <div className="mb-3 sm:mb-4 text-center">
                        <div className="text-sm sm:text-base lg:text-lg font-semibold mb-2 text-white">
                            {replayStep >= totalMoves ? getWinnerDisplay() : `${getCurrentPlayer()}'s Turn`}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-400">
                            Move {replayStep} of {totalMoves}
                        </div>
                    </div>

                    <div className="w-full flex justify-center max-w-lg lg:max-w-none mb-3 sm:mb-4">
                        <Board
                            size="lg"
                            rows={boardRows}
                            cols={boardCols}
                            board={currentBoard}
                            currentPlayer={getCurrentPlayer()}
                            gameStatus={gameStatus}
                            winningLine={winningLine}
                            onCellClick={() => {}}
                            disabled
                        />
                    </div>

                    <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-md mx-auto">
                        <div className="flex justify-center gap-2 sm:gap-2 flex-wrap">
                            <PlayfulButton
                                size="md"
                                variant="secondary"
                                onClick={handleRestart}
                                disabled={replayStep === 0}
                            >
                                <SolarRestart2Bold />
                            </PlayfulButton>
                            
                            <PlayfulButton
                                size="md"
                                variant="secondary"
                                onClick={handlePrevious}
                                disabled={replayStep === 0}
                            >
                                <SolarArrowLeftBold />
                            </PlayfulButton>
                            
                            <PlayfulButton
                                size="md"
                                variant="primary"
                                onClick={handlePlayPause}
                                disabled={replayStep >= totalMoves}
                            >
                                {isPlaying ? <SolarPauseBold /> : <SolarPlayBold />}
                                
                            </PlayfulButton>
                            
                            <PlayfulButton
                                size="md"
                                variant="secondary"
                                onClick={handleNext}
                                disabled={replayStep >= totalMoves}
                            >
                                <SolarArrowRightBold />
                            </PlayfulButton>
                            
                            <PlayfulButton
                                size="md"
                                variant="warning"
                                onClick={handleSpeedChange}
                                className="hidden sm:flex"
                            >
                                <span className="hidden md:inline ml-1">{getSpeedLabel()}</span>
                            </PlayfulButton>
                        </div>

                        <div className="w-full">
                            <input
                                type="range"
                                min="0"
                                max={totalMoves}
                                value={replayStep}
                                onChange={(e) => {
                                    setIsPlaying(false)
                                    setReplayStep(parseInt(e.target.value))
                                }}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(replayStep / totalMoves) * 100}%, #374151 ${(replayStep / totalMoves) * 100}%, #374151 100%)`
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-80 xl:w-96 bg-gray-800 rounded-lg p-3 sm:p-4 min-h-0">
                    <h3 className="font-semibold mb-3 text-white text-sm sm:text-base">Game Info</h3>
                    <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between text-gray-300">
                            <span>Board Size:</span>
                            <span>{boardRows}×{boardCols}</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                            <span>AI Difficulty:</span>
                            <span className="capitalize">{history.gameSetting.aiDifficulty}</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                            <span>Duration:</span>
                            <span>{Math.floor(history.gameSetting.duration / 60)}:{(history.gameSetting.duration % 60).toString().padStart(2, '0')}</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                            <span>Total Moves:</span>
                            <span>{totalMoves}</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                            <span>Result:</span>
                            <span>{getWinnerDisplay()}</span>
                        </div>
                    </div>

                    <h3 className="font-semibold mt-4 sm:mt-6 mb-3 text-white text-sm sm:text-base">Move History</h3>
                    <div className="max-h-32 sm:max-h-48 lg:max-h-64 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700">
                        {history.moves.map((move, index) => (
                            <div
                                key={index}
                                className={`text-xs p-2 rounded cursor-pointer transition-colors ${
                                    index < replayStep 
                                        ? 'bg-blue-900 text-blue-300 border border-blue-700' 
                                        : index === replayStep 
                                        ? 'bg-yellow-900 text-yellow-300 font-semibold border border-yellow-700'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                                onClick={() => {
                                    setIsPlaying(false)
                                    setReplayStep(index + 1)
                                }}
                            >
                                <div className="flex justify-between">
                                    <span>Move {index + 1}: {move.symbol}</span>
                                    <span>({move.position.row + 1}, {move.position.col + 1})</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameReplay

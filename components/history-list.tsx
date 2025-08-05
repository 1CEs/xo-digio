import { useEffect } from 'react'
import { useHistoryStore } from '@/stores/history'
import { useAuthStore } from '@/stores/auth'
import PlayfulButton from './playful-button'
import { MingcutePlayFill, SolarCalendarBold, SolarTimeBold } from './icons'
import { IHistory } from '@/database/schema/user.interface'

interface HistoryListProps {
    onReplay: (history: IHistory) => void
    onClose: () => void
}

const HistoryList = ({ onReplay, onClose }: HistoryListProps) => {
    const { histories, loading, error, fetchHistories, clearError } = useHistoryStore()
    const { user } = useAuthStore()

    useEffect(() => {
        if (user) {
            fetchHistories()
        }
    }, [user, fetchHistories])

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const getWinnerDisplay = (winner: string | null, gameStatus: string) => {
        if (gameStatus === 'draw') return 'Draw'
        if (gameStatus === 'abandoned') return 'Abandoned'
        if (!winner) return 'In Progress'
        
        switch (winner) {
            case 'st': return 'Player X'
            case 'nd': return 'Player O'
            case 'bot': return 'Bot'
            default: return winner
        }
    }

    const getWinnerColor = (winner: string | null, gameStatus: string) => {
        if (gameStatus === 'draw') return 'text-warning'
        if (gameStatus === 'abandoned') return 'text-gray-400'
        if (!winner) return 'text-blue-400'
        
        switch (winner) {
            case 'st': return 'text-primary'
            case 'nd': return 'text-secondary'
            case 'bot': return 'text-red-400'
            default: return 'text-gray-300'
        }
    }

    if (!user) {
        return (
            <div className="bg-gray-900 rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl mx-auto">
                <div className="text-center">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">Game History</h2>
                    <div className="mb-6">
                        <div className="text-4xl sm:text-6xl mb-4">🏆</div>
                        <p className="text-gray-300 mb-2 text-base sm:text-lg">Track Your Gaming Journey</p>
                        <p className="text-gray-400 text-sm mb-4">
                            Sign in to save your games, view detailed statistics, and replay your best matches!
                        </p>
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 sm:p-4 mb-4">
                            <h3 className="font-semibold text-blue-400 mb-2 text-sm sm:text-base">Features you'll unlock:</h3>
                            <ul className="text-xs sm:text-sm text-gray-300 text-left space-y-1">
                                <li>• Save and replay your games</li>
                                <li>• Track win/loss statistics</li>
                                <li>• Analyze your gameplay patterns</li>
                                <li>• Share replays with friends</li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <PlayfulButton variant="primary" onClick={() => window.location.href = '/member/sign-in'}>
                            Sign In
                        </PlayfulButton>
                        <PlayfulButton variant="secondary" onClick={onClose}>
                            Close
                        </PlayfulButton>
                    </div>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="bg-gray-900 rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl mx-auto">
                <div className="text-center">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">Game History</h2>
                    <div className="animate-spin rounded-full h-8 sm:h-12 w-8 sm:w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-300 text-sm sm:text-base">Loading your game history...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-gray-900 rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl mx-auto">
                <div className="text-center">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">Game History</h2>
                    <div className="text-red-400 mb-4">
                        <p className="font-semibold text-sm sm:text-base">Error loading history</p>
                        <p className="text-xs sm:text-sm text-gray-400">{error}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <PlayfulButton variant="primary" onClick={() => {
                            clearError()
                            fetchHistories()
                        }}>
                            Try Again
                        </PlayfulButton>
                        <PlayfulButton variant="secondary" onClick={onClose}>
                            Close
                        </PlayfulButton>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-4xl mx-auto flex flex-col max-h-[90vh] sm:max-h-[80vh]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Game History</h2>
                <PlayfulButton variant="secondary" onClick={onClose}>
                    Close
                </PlayfulButton>
            </div>

            {histories.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                    <p className="text-gray-300 mb-4 text-sm sm:text-base">No games played yet</p>
                    <p className="text-xs sm:text-sm text-gray-400">Start playing to build your history!</p>
                </div>
            ) : (
                <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    <div className="space-y-3">
                        {histories.map((history) => (
                            <div
                                key={history.id}
                                className="border border-gray-700 bg-gray-800 rounded-lg p-3 sm:p-4 hover:bg-gray-750 hover:border-gray-600 transition-all duration-200"
                            >
                                <div className="flex flex-col lg:flex-row justify-between items-start gap-3">
                                    <div className="flex-1 w-full">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-2">
                                            <div className="flex items-center gap-1">
                                                <span className="text-xl sm:text-2xl">🏆</span>
                                                <span className={`font-semibold text-sm sm:text-base ${getWinnerColor(history.winner, history.gameStatus)}`}>
                                                    {getWinnerDisplay(history.winner, history.gameStatus)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <div className="text-xs sm:text-sm text-gray-400">
                                                    {history.gameSetting.boardRows}×{history.gameSetting.boardCols}
                                                </div>
                                                <div className="text-xs sm:text-sm text-gray-400 capitalize">
                                                    {history.gameSetting.aiDifficulty}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <SolarCalendarBold className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span className="text-xs sm:text-sm">{formatDate(history.createdAt)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <SolarTimeBold className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span className="text-xs sm:text-sm">{formatDuration(history.gameSetting.duration)}</span>
                                            </div>
                                            <div className="text-xs">
                                                {history.moves.length} moves
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="w-full lg:w-auto lg:ml-4">
                                        <PlayfulButton
                                            size="sm"
                                            variant="primary"
                                            startIcon={<MingcutePlayFill />}
                                            onClick={() => onReplay(history)}
                                            className="w-full lg:w-auto"
                                        >
                                            Replay
                                        </PlayfulButton>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default HistoryList

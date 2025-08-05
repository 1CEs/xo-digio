"use client"

import { IMove } from "@/database/schema/user.interface"

interface MoveTrackerProps {
  moves: IMove[]
  currentPlayer: 'X' | 'O'
  gameMode: 'vs-friend' | 'vs-bot'
  className?: string
}

const MoveTracker = ({ moves, currentPlayer, gameMode, className = "" }: MoveTrackerProps) => {
  const getPlayerName = (player: 'X' | 'O') => {
    if (gameMode === 'vs-bot') {
      return player === 'X' ? 'You' : 'Bot'
    }
    return `Player ${player}`
  }

  const getPlayerIcon = (player: 'X' | 'O') => {
    return player === 'X' ? '❌' : '⭕'
  }

  return (
    <div className={`bg-white/10 rounded-lg p-4 border border-gray-700 w-full ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Move History</h3>
        <div className="text-sm text-gray-400">
          {moves.length} moves
        </div>
      </div>

      {/* Current Turn Indicator */}
      <div className="mb-4 p-3 bg-white/20 rounded-lg border border-gray-600">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getPlayerIcon(currentPlayer)}</span>
          <span className="text-white font-medium">
            {getPlayerName(currentPlayer)}'s Turn
          </span>
        </div>
      </div>

      {/* Move List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {moves.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No moves yet. Game will start soon!
          </div>
        ) : (
          moves.map((move, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-white/20 rounded border border-gray-700 hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 font-mono w-6">
                  #{index + 1}
                </span>
                <span className="text-lg">
                  {getPlayerIcon(move.symbol)}
                </span>
                <span className="text-white text-sm">
                  {getPlayerName(move.symbol)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-300 text-sm font-mono">
                  ({move.position.row + 1}, {move.position.col + 1})
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(move.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Game Stats */}
      {moves.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-400">X Moves</div>
              <div className="text-white font-semibold">
                {moves.filter(m => m.symbol === 'X').length}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">O Moves</div>
              <div className="text-white font-semibold">
                {moves.filter(m => m.symbol === 'O').length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MoveTracker

export interface IGameSetting {
    duration: number
    boardRows: number
    boardCols: number
    aiDifficulty: 'easy' | 'medium' | 'hard'
}

export interface IMove {
    playerId: 'st' | 'nd' | 'bot'
    symbol: 'X' | 'O'
    position: {
        row: number
        col: number
    }
    timestamp: Date
    moveNumber: number
}

export interface IHistory {
    id: string
    gameStatus: 'completed' | 'abandoned' | 'in_progress'
    winner: 'st' | 'nd' | 'draw' | 'bot' | null
    gameSetting: IGameSetting
    moves: IMove[]
    createdAt: Date
    updatedAt: Date
}

export interface IUser {
    id: string
    username: string
    email: string
    password: string
    avatar: string
    history: IHistory[]
    createdAt: Date
    updatedAt: Date
}
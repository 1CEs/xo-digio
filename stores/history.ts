import { create } from 'zustand'
import { IHistory, IMove, IGameSetting } from '@/database/schema/user.interface'

interface HistoryState {
    histories: IHistory[]
    currentReplay: IHistory | null
    replayStep: number
    isReplaying: boolean
    loading: boolean
    error: string | null
}

interface HistoryActions {
    fetchHistories: () => Promise<void>
    saveGame: (gameData: {
        gameStatus: 'completed' | 'abandoned' | 'in_progress'
        winner: 'st' | 'nd' | 'draw' | 'bot' | null
        gameSetting: IGameSetting
        moves: IMove[]
    }) => Promise<void>
    startReplay: (history: IHistory) => void
    nextReplayStep: () => void
    prevReplayStep: () => void
    setReplayStep: (step: number) => void
    stopReplay: () => void
    clearError: () => void
}

export const useHistoryStore = create<HistoryState & HistoryActions>((set, get) => ({
    histories: [],
    currentReplay: null,
    replayStep: 0,
    isReplaying: false,
    loading: false,
    error: null,

    fetchHistories: async () => {
        set({ loading: true, error: null })
        try {
            const response = await fetch('/api/history')
            if (!response.ok) {
                throw new Error('Failed to fetch histories')
            }
            const result = await response.json()
            set({ histories: result.data, loading: false })
        } catch (error) {
            set({ 
                error: error instanceof Error ? error.message : 'Unknown error',
                loading: false 
            })
        }
    },

    saveGame: async (gameData) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch('/api/history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gameData),
            })
            
            if (!response.ok) {
                throw new Error('Failed to save game')
            }
            
            const result = await response.json()
            set(state => ({
                histories: [result.data, ...state.histories],
                loading: false
            }))
        } catch (error) {
            set({ 
                error: error instanceof Error ? error.message : 'Unknown error',
                loading: false 
            })
        }
    },

    startReplay: (history) => {
        set({
            currentReplay: history,
            replayStep: 0,
            isReplaying: true
        })
    },

    nextReplayStep: () => {
        const { currentReplay, replayStep } = get()
        if (currentReplay && replayStep < currentReplay.moves.length) {
            set({ replayStep: replayStep + 1 })
        }
    },

    prevReplayStep: () => {
        const { replayStep } = get()
        if (replayStep > 0) {
            set({ replayStep: replayStep - 1 })
        }
    },

    setReplayStep: (step) => {
        const { currentReplay } = get()
        if (currentReplay && step >= 0 && step <= currentReplay.moves.length) {
            set({ replayStep: step })
        }
    },

    stopReplay: () => {
        set({
            currentReplay: null,
            replayStep: 0,
            isReplaying: false
        })
    },

    clearError: () => {
        set({ error: null })
    }
}))

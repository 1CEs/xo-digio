import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { customizationSchema } from "@/validation/setting";
import { z } from "zod";

type CustomizationFormData = z.infer<typeof customizationSchema>

interface SettingStore {
    boardRows: number
    boardCols: number
    aiDifficulty: 'easy' | 'medium' | 'hard'
    setBoardRows: (rows: number) => void
    setBoardCols: (cols: number) => void
    setAiDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void
    updateSettings: (settings: CustomizationFormData) => void
    getSettings: () => CustomizationFormData
    resetSettings: () => void
}

const defaultSettings: CustomizationFormData = {
    boardRows: 3,
    boardCols: 3,
    aiDifficulty: 'medium'
}

export const useSettingStore = create<SettingStore>()(persist(
    (set, get) => ({
        ...defaultSettings,
        setBoardRows: (rows: number) => {
            const result = customizationSchema.safeParse({ 
                ...get(), 
                boardRows: rows 
            })
            if (result.success) {
                set({ boardRows: rows })
            }
        },
        setBoardCols: (cols: number) => {
            const result = customizationSchema.safeParse({ 
                ...get(), 
                boardCols: cols 
            })
            if (result.success) {
                set({ boardCols: cols })
            }
        },
        setAiDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => {
            const result = customizationSchema.safeParse({ 
                ...get(), 
                aiDifficulty: difficulty 
            })
            if (result.success) {
                set({ aiDifficulty: difficulty })
            }
        },
        updateSettings: (settings: CustomizationFormData) => {
            const result = customizationSchema.safeParse(settings)
            if (result.success) {
                set({
                    boardRows: settings.boardRows,
                    boardCols: settings.boardCols,
                    aiDifficulty: settings.aiDifficulty
                })
            } else {
                console.error('Invalid settings:', result.error)
            }
        },
        getSettings: () => {
            const { boardRows, boardCols, aiDifficulty } = get()
            return { boardRows, boardCols, aiDifficulty }
        },
        resetSettings: () => set(defaultSettings)
    }),
    {
        name: "game-settings",
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => (state) => {
            if (state) {
                const result = customizationSchema.safeParse({
                    boardRows: state.boardRows,
                    boardCols: state.boardCols,
                    aiDifficulty: state.aiDifficulty
                })
                if (!result.success) {
                    console.warn('Invalid stored settings, resetting to defaults')
                    state.resetSettings()
                }
            }
        }
    }
))

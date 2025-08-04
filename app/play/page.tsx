"use client"

import { useState } from "react"
import PlayfulButton from "@/components/playful-button"
import { FluentBot16Filled, IconParkSolidSettingTwo, MaterialSymbolsHistory, MingcutePlayFill } from "@/components/icons"
import Board from "@/components/board"
import CustomizeModal from "@/components/modals/customize-modal"
import { useSettingStore } from "@/stores/setting"
import { z } from "zod"
import { customizationSchema } from "@/validation/setting"

type CustomizationFormData = z.infer<typeof customizationSchema>

const ActionButton = ({ onCustomizeClick }: { onCustomizeClick: () => void }) => {
    return (
        <div className="flex flex-col gap-4 items-center justify-center">
            <PlayfulButton className="w-full" startIcon={<MingcutePlayFill fontSize={32}/>} size="xl" variant="primary">
                VS FRIEND
            </PlayfulButton>
            <PlayfulButton className="w-fit" startIcon={<FluentBot16Filled fontSize={32}/> } size="xl" variant="secondary">
                VS BOT
            </PlayfulButton>
            <PlayfulButton className="w-fit" startIcon={<MaterialSymbolsHistory fontSize={24}/> } size="lg" variant="success">
                HISTORY
            </PlayfulButton>
            <PlayfulButton 
                className="w-full" 
                startIcon={<IconParkSolidSettingTwo fontSize={24}/> } 
                size="lg" 
                variant="warning"
                onClick={onCustomizeClick}
            >
                CUSTOMIZATION
            </PlayfulButton>
        </div>
    )
}

function PlayPage() {
    const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false)
    
    // Use Zustand store for settings
    const { boardRows, boardCols, aiDifficulty, getSettings } = useSettingStore()

    const handleCustomizeClick = () => {
        setIsCustomizeModalOpen(true)
    }

    const handleCustomizeSave = (data: CustomizationFormData) => {
        // Settings are already saved to Zustand store in the modal
        console.log('Game settings updated:', data)
    }

    const handleCustomizeClose = () => {
        setIsCustomizeModalOpen(false)
    }

    return (
        <>
            <div className="flex h-full w-full items-center justify-center gap-36 flex-wrap-reverse">
                <Board size="xl" idle rows={boardRows} cols={boardCols} />
                <div className="flex flex-col gap-4 items-center justify-center">
                    <div className="flex flex-col gap-2 items-center justify-center pb-6">
                        <h1 className="text-3xl font-bold text-center">Play Tic Tac Toe</h1>
                        <h1 className="text-3xl font-bold text-center">With Your Friends</h1>
                        <div className="text-sm mt-2">
                            Board: {boardRows}×{boardCols} | AI: {aiDifficulty}
                        </div>
                    </div>
                    <ActionButton onCustomizeClick={handleCustomizeClick} />
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

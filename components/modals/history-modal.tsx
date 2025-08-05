import { useState } from 'react'
import HistoryList from '../history-list'
import GameReplay from '../game-replay'
import { IHistory } from '@/database/schema/user.interface'

interface HistoryModalProps {
    isOpen: boolean
    onClose: () => void
}

const HistoryModal = ({ isOpen, onClose }: HistoryModalProps) => {
    const [selectedHistory, setSelectedHistory] = useState<IHistory | null>(null)

    if (!isOpen) return null

    const handleReplay = (history: IHistory) => {
        setSelectedHistory(history)
    }

    const handleBackToList = () => {
        setSelectedHistory(null)
    }

    const handleClose = () => {
        setSelectedHistory(null)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="w-full h-full flex items-center justify-center overflow-auto">
                {selectedHistory ? (
                    <GameReplay 
                        history={selectedHistory} 
                        onClose={handleBackToList}
                    />
                ) : (
                    <HistoryList 
                        onReplay={handleReplay}
                        onClose={handleClose}
                    />
                )}
            </div>
        </div>
    )
}

export default HistoryModal

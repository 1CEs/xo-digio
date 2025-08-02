"use client"

import PlayfulButton from "@/components/playful-button"
import { FluentBot16Filled, IconParkSolidSettingTwo, MaterialSymbolsHistory, MingcutePlayFill } from "@/components/icons"
import Board from "@/components/board"

const ActionButton = () => {
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
            <PlayfulButton className="w-full" startIcon={<IconParkSolidSettingTwo fontSize={24}/> } size="lg" variant="warning">
                CUSTOMIZATION
            </PlayfulButton>
        </div>
    )
}

function PlayPage() {
    return (
        <div className="flex h-full w-full items-center justify-center gap-36">
            <Board size="xl" idle/>
            <div className="flex flex-col gap-4 items-center justify-center">
                <div className="flex flex-col gap-2 items-center justify-center pb-6">
                    <h1 className="text-3xl font-bold text-center">Play Tic Tac Toe</h1>
                    <h1 className="text-3xl font-bold text-center">With Your Friends</h1>
                </div>
                <ActionButton />
            </div>
        </div>
    )
}

export default PlayPage

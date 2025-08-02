"use client"
import React, { useEffect, useState } from 'react'

type BlockProps = {
    placeBy: "x" | "o" | string
    bounce: boolean
}

const Block = ({ placeBy, bounce }: BlockProps) => {
    return (
        <div
            className={`
            w-18 h-18 font-bold text-3xl rounded-2xl flex items-center justify-center text-center
            ${placeBy === "x" ? "bg-primary" : "bg-disabled"}
            ${bounce && placeBy === "x" ? "animate-pulse" : ""}
            `}
        >
            {placeBy}
        </div>
    )
}

const pattern = [
    "x", "o", "",
    "", "x", "o",
    "o", "", "x"
]

const MockBoard = () => {
    const [bounce, setBounce] = useState(false)
    const [placedPattern, setPlacedPattern] = useState([
        "", "", "",
        "", "", "",
        "", "", ""
    ])

    useEffect(() => {

        const timeouts: NodeJS.Timeout[] = []
        
        for (let i = 0; i < 9; i++) {
            const timeout = setTimeout(() => {
                setPlacedPattern(prev => {
                    const newPattern = [...prev]
                    newPattern[i] = pattern[i]
                    return newPattern
                })
            }, i * 250)
            timeouts.push(timeout)
        }

        setTimeout(() => {
            setBounce(true)
        }, 9 * 250)

        return () => {
            timeouts.forEach(timeout => clearTimeout(timeout))
        }
    }, [])

    return (
        <div className="grid grid-cols-3 grid-rows-3 gap-2">
            {
                Array.from({ length: 9 }).map((_, index) => (
                    <Block key={index} placeBy={placedPattern[index]} bounce={bounce} />
                ))
            }
        </div>
    )
}

export default MockBoard
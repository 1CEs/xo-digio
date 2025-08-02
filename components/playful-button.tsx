"use client"
import React, { useState } from 'react'

type Props = {
    href?: string
    children: React.ReactNode
    size: "sm" | "md" | "lg" | "xl"
    variant: "primary" | "secondary" | "disabled" | "success" | "warning" | "danger"
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const PlayfulButton = ({ href, children, size = "md", variant = "primary", className = "", ...props }: Props) => {
    const [isDown, setIsDown] = useState(false)
    const getVariantClasses = () => {
        return {
            border: `bg-${variant} shadow-blue-500/50`,
            inner: `bg-${variant} shadow-blue-500/50`,
            boxShadow: `inset 5px 5px 10px var(--background), inset -20px -20px 60px var(--${variant})`
        }
    }
    const variantClasses = getVariantClasses()
    const sizeClasses = {
        sm: "w-24 h-10 text-md font-medium",
        md: "w-28 h-12 text-lg font-medium",
        lg: "w-36 h-16 text-xl font-semibold",
        xl: "w-48 h-20 text-2xl font-bold",
    }[size]

    return (
        <button
            
            {...props}
            onMouseDown={() => setIsDown(true)}
            onMouseUp={() => setIsDown(false)}
            className={`${className} ${sizeClasses} ${variantClasses.border} 
                        flex items-center justify-center p-1
                        cursor-pointer rounded-full
                        transition-colors duration-200 ease-in-out
                        `}>
            <div
                style={isDown ? {
                    boxShadow: variantClasses.boxShadow
                } : undefined}
                className={`rounded-full w-full h-full flex items-center 
                        justify-center ${variantClasses.inner}
                        border-black/50
                        ${isDown ? "border-t-4 border-b-0" : "border-t-0 border-b-8"}
                        `}>
                <span className="z-10">
                    {children}
                </span>
            </div>


        </button>
    )
}

export default PlayfulButton
"use client"
import React, { useState } from 'react'

type Props = {
    href?: string
    children: React.ReactNode
    startIcon?: React.ReactNode
    endIcon?: React.ReactNode
    size?: "sm" | "md" | "lg" | "xl"
    variant: "primary" | "secondary" | "disabled" | "success" | "warning" | "danger"
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const PlayfulButton = ({ href, children, startIcon, endIcon, size = "md", variant = "primary", className = "", ...props }: Props) => {
    const [isDown, setIsDown] = useState(false)
    const getVariantClasses = () => {
        const variantMap = {
            primary: {
                border: "bg-primary shadow-blue-500/50",
                inner: "bg-primary shadow-blue-500/50",
                boxShadow: "inset 5px 5px 10px var(--background), inset -20px -20px 60px var(--primary)"
            },
            secondary: {
                border: "bg-secondary shadow-purple-500/50",
                inner: "bg-secondary shadow-purple-500/50",
                boxShadow: "inset 5px 5px 10px var(--background), inset -20px -20px 60px var(--secondary)"
            },
            success: {
                border: "bg-success shadow-green-500/50",
                inner: "bg-success shadow-green-500/50",
                boxShadow: "inset 5px 5px 10px var(--background), inset -20px -20px 60px var(--success)"
            },
            warning: {
                border: "bg-warning shadow-yellow-500/50",
                inner: "bg-warning shadow-yellow-500/50",
                boxShadow: "inset 5px 5px 10px var(--background), inset -20px -20px 60px var(--warning)"
            },
            danger: {
                border: "bg-danger shadow-red-500/50",
                inner: "bg-danger shadow-red-500/50",
                boxShadow: "inset 5px 5px 10px var(--background), inset -20px -20px 60px var(--danger)"
            },
            disabled: {
                border: "bg-disabled shadow-gray-500/50",
                inner: "bg-disabled shadow-gray-500/50",
                boxShadow: "inset 5px 5px 10px var(--background), inset -20px -20px 60px var(--disabled)"
            }
        }
        return variantMap[variant]
    }
    const variantClasses = getVariantClasses()
    const sizeClasses = {
        sm: "h-10 text-md font-medium px-4",
        md: "h-12 text-lg font-medium px-6",
        lg: "h-16 text-xl font-semibold px-8",
        xl: "h-20 text-2xl font-bold px-10",
    }[size]

    return (
        <button

            {...props}
            onMouseDown={() => setIsDown(true)}
            onMouseUp={() => setIsDown(false)}
            className={`${className} ${sizeClasses} ${variantClasses.border} 
                        inline-flex items-center justify-center p-1
                        cursor-pointer rounded-full
                        transition-colors duration-200 ease-in-out
                        `}>
            <div
                style={isDown ? {
                    boxShadow: variantClasses.boxShadow
                } : undefined}
                className={`rounded-full w-full h-full inline-flex items-center px-4
                         gap-2 ${variantClasses.inner} border-black/50 justify-center
                        ${isDown ? "border-t-4 border-b-0" : "border-t-0 border-b-8"}
                        `}>
                {startIcon && <div className="flex items-center justify-center focus:outline-none">{startIcon}</div>}
                <span className="z-10">
                    {children}
                </span>
                {endIcon && <div className="flex items-center justify-center focus:outline-none">{endIcon}</div>}
            </div>


        </button>
    )
}

export default PlayfulButton
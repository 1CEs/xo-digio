import React from 'react'

type Props = {
    children: React.ReactNode
    size: "sm" | "md" | "lg" | "xl"
    variant: "primary" | "secondary" | "default"
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const PlayfulButton = ({ children, size = "md", variant = "primary", ...props }: Props) => {

    const variantClasses = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        default: "bg-gray-500 text-gray-50 hover:bg-gray-600",
    }[variant]

    const sizeClasses = {
        sm: "px-2 py-1 text-md font-medium",
        md: "px-4 py-2 text-lg font-medium",
        lg: "px-8 py-4 text-xl font-semibold",
        xl: "px-14 py-6 text-2xl font-bold",
    }[size]

    return (
        <button
            {...props}
            className={`${props.className} ${sizeClasses} ${variantClasses} 
                        flex items-center justify-center
                        cursor-pointer rounded-xl
                        transition-colors duration-200 ease-in-out
                        `}>
            <span>
                {children}
            </span>
        </button>
    )
}

export default PlayfulButton
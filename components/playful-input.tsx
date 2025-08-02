import React from 'react'

type Props = {
    errMessage?: string
    color?: "primary" | "secondary" | "disabled" | "success" | "warning" | "danger"
    startIcon?: React.ReactNode
    endIcon?: React.ReactNode
} & React.InputHTMLAttributes<HTMLInputElement>

const PlayfulInput = ({ errMessage, color = "primary", startIcon, endIcon, ...props }: Props) => {
    return (
        <div className="flex flex-col gap-2 text-black w-full">
            <div className='bg-white rounded-full p-1 w-full flex items-center justify-center'>
                {startIcon && <div className="flex items-center justify-center w-8 h-8">{startIcon}</div>}
                <input {...props} className={`bg-white border-b-8 placeholder:text-sm border-black/50 rounded-full p-2 w-full`} />
                {endIcon && <div className="flex items-center justify-center w-8 h-8">{endIcon}</div>}
            </div>
            {errMessage && <p className="text-red-500">{errMessage}</p>}
        </div>

    )
}

export default PlayfulInput
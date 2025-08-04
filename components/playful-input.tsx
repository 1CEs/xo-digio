import React, { forwardRef } from 'react'

type Props = {
    errMessage?: string
    color?: "primary" | "secondary" | "disabled" | "success" | "warning" | "danger"
    startIcon?: React.ReactNode
    endIcon?: React.ReactNode
} & React.InputHTMLAttributes<HTMLInputElement>

const PlayfulInput = forwardRef<HTMLInputElement, Props>(({ errMessage, color = "primary", startIcon, endIcon, ...props }, ref) => {
    return (
        <div className="flex flex-col gap-2 text-black w-full">
            <div className='bg-white rounded-full p-1 w-full flex items-center justify-center'>
                <div className="flex items-center justify-center w-full gap-2 bg-white border-b-8 border-black/50 rounded-full px-2">
                    {startIcon && <div className="flex items-center justify-center w-8 h-8 focus:outline-none">{startIcon}</div>}
                    <input {...props} ref={ref} className={`placeholder:text-sm p-2 w-full focus:outline-none rounded-r-full`} />
                    {endIcon && <div className="flex items-center justify-center w-8 h-8 focus:outline-none">{endIcon}</div>}
                </div>

            </div>
            {errMessage && <p className="text-danger text-xs">*{errMessage}</p>}
        </div>

    )
});

export default PlayfulInput
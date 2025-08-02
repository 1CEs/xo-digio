import React from 'react'
import Image from 'next/image'
import Logo from '@/public/logo.svg'

type Props = {
    onSubmit: (data: any) => void
    children: React.ReactNode
}

const Form = (props: Props) => {
    const { onSubmit, children } = props
    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-4 items-center justify-center 
                        rounded-xl border-b-primary border-r-primary 
                        xl:w-1/6 lg:w-1/4 md:w-1/3"
            >
            <Image src={Logo} alt="Logo" width={150} height={150} />
            {children}
        </form>
    )
}

export default Form
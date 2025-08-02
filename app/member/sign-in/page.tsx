"use client"

import { IcRoundEmail, SolarPasswordBold, SolarUserBold } from "@/components/icons";
import Form from "@/components/member/form"
import PlayfulInput from "@/components/playful-input";
import { useForm } from "react-hook-form";
import { signInSchema } from "@/validation/form";
import { zodResolver } from "@hookform/resolvers/zod";
import PlayfulButton from "@/components/playful-button";
import type { z } from "zod"
import Link from "next/link";

function SignInPage() {
    type FormValues = z.infer<typeof signInSchema>
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<FormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            usernameOrEmail: '',
            password: ''
        }
    })
    
    const onSubmit = async (data: FormValues) => {
        try {
            console.log('Sign in data:', data)
        } catch (error) {
            console.error('Error signing in:', error)
        }
    }
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full">
                <PlayfulInput 
                    errMessage={errors.usernameOrEmail?.message}
                    placeholder="Username or Email" 
                    startIcon={<SolarUserBold />} 
                    {...register('usernameOrEmail')} 
                />
            </div>
            <div className="w-full">
                <PlayfulInput 
                    errMessage={errors.password?.message}
                    placeholder="Password" 
                    type="password"
                    startIcon={<SolarPasswordBold />} 
                    {...register('password')} 
                />
            </div>
            <div className="w-full flex items-center justify-between">
                <PlayfulButton size="md" variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'SIGNING IN...' : 'SIGN IN'}
                </PlayfulButton>
                <Link href="/member/sign-up" className="text-xs underline">Don't have an account?</Link>
            </div>
        </Form>
    );
}

export default SignInPage

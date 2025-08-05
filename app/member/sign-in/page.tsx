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
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "nextjs-toploader/app";
import { toast } from 'react-toastify';

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
    
    const { signIn, isLoading } = useAuthStore();
    const router = useRouter();
    
    const onSubmit = async (data: FormValues) => {
        try {
            const result = await signIn(data.usernameOrEmail, data.password);
            
            if (result.success) {
                toast.success('Welcome back! Redirecting to game...', {
                    position: "top-right",
                    autoClose: 2000,
                });
                
                setTimeout(() => {
                    router.push('/play');
                }, 1000);
            } else {
                toast.error(result.message, {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
        } catch (error) {
            console.error('Error signing in:', error);
            toast.error('Network error. Please check your connection and try again.', {
                position: "top-right",
                autoClose: 5000,
            });
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
                <PlayfulButton size="md" variant="primary" type="submit" disabled={isSubmitting || isLoading}>
                    {(isSubmitting || isLoading) ? 'SIGNING IN...' : 'SIGN IN'}
                </PlayfulButton>
                <Link href="/member/sign-up" className="text-xs underline">Don't have an account?</Link>
            </div>
        </Form>
    );
}

export default SignInPage

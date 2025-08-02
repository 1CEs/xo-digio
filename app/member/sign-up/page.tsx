"use client"

import PlayfulButton from "@/components/playful-button"
import PlayfulInput from "@/components/playful-input"
import Image from "next/image"
import Logo from "@/public/logo.svg"
import { SolarPasswordBold, IcRoundEmail, SolarUserBold, SolarEyeBold, BiEyeSlashFill } from "@/components/icons"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema } from "@/validation/form"
import type { z } from "zod"
import Form from "@/components/member/form"

function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')
  type FormValues = z.infer<typeof signUpSchema>;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const watchedPassword = watch('password')

  useEffect(() => {
    setPasswordValue(watchedPassword || '')
  }, [watchedPassword])

  const onSubmit = async (data: FormValues) => {
    try {
      console.log('Form submitted successfully:', data)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const hasMinLength = passwordValue.length >= 8
  const hasUppercase = /[A-Z]/.test(passwordValue)
  const hasLowercase = /[a-z]/.test(passwordValue)
  const hasNumber = /\d/.test(passwordValue)
  const hasSpecialChar = /[!@#$%^&*()_+]/.test(passwordValue)

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full">
        <PlayfulInput
          errMessage={errors.username?.message}
          placeholder="Username"
          startIcon={<SolarUserBold />}
          {...register('username')}
        />
      </div>

      <div className="w-full">
        <PlayfulInput
          errMessage={errors.email?.message}
          placeholder="Email"
          startIcon={<IcRoundEmail />}
          {...register('email')}
        />
      </div>

      <div className="w-full">
        <PlayfulInput
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          startIcon={<SolarPasswordBold />}
          {...register('password')}
        />
      </div>

      <div className="w-full">
        <PlayfulInput
          placeholder="Confirm Password"
          type={showPassword ? "text" : "password"}
          startIcon={<SolarPasswordBold />}
          endIcon={
            showPassword ?
              <BiEyeSlashFill className="cursor-pointer" onClick={() => setShowPassword(!showPassword)} /> :
              <SolarEyeBold className="cursor-pointer" onClick={() => setShowPassword(!showPassword)} />}
          {...register('confirmPassword')}
        />
      </div>

      <div className="flex flex-col gap-2 text-xs w-full bg-disabled/25 p-4 rounded-xl">
        <p className={hasMinLength ? 'text-success' : 'text-gray-500'}>
          Password must contain at least 8 characters
        </p>
        <p className={hasUppercase ? 'text-success' : 'text-gray-500'}>
          one uppercase letter
        </p>
        <p className={hasLowercase ? 'text-success' : 'text-gray-500'}>
          one lowercase letter
        </p>
        <p className={hasNumber ? 'text-success' : 'text-gray-500'}>
          one number
        </p>
        <p className={hasSpecialChar ? 'text-success' : 'text-gray-500'}>
          and one special character: !@#$%^&*()_+
        </p>
      </div>

      <div className="w-full flex items-center justify-between">
        <PlayfulButton size="md" variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'SIGNING UP...' : 'SIGN UP'}
        </PlayfulButton>
        <Link href="/member/sign-in" className="text-xs underline">Already have an account?</Link>
      </div>
    </Form>
  )
}

export default SignUpPage
"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { customizationSchema } from '@/validation/setting'
import PlayfulInput from '@/components/playful-input'
import PlayfulButton from '@/components/playful-button'
import { IcomoonFreeCross, IconParkSolidSettingTwo } from '@/components/icons'
import { z } from 'zod'

type CustomizationFormData = z.infer<typeof customizationSchema>

type Props = {
    isOpen: boolean
    onClose: () => void
    onSave: (data: CustomizationFormData) => void
    initialValues?: Partial<CustomizationFormData>
}

const CustomizeModal = ({ isOpen, onClose, onSave, initialValues }: Props) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
        setValue,
        getValues
    } = useForm<CustomizationFormData>({
        resolver: zodResolver(customizationSchema),
        defaultValues: {
            boardRows: initialValues?.boardRows || 3,
            boardCols: initialValues?.boardCols || 3,
            aiDifficulty: initialValues?.aiDifficulty || 'medium'
        }
    })

    const watchedRows = watch('boardRows')
    const watchedCols = watch('boardCols')
    const watchedDifficulty = watch('aiDifficulty')

    // Handlers for increment/decrement
    const handleRowsChange = (increment: boolean) => {
        const currentRows = getValues('boardRows') || 3
        const newValue = increment ? currentRows + 1 : currentRows - 1
        if (newValue >= 3 && newValue <= 10) {
            setValue('boardRows', newValue, { shouldValidate: true })
        }
    }

    const handleColsChange = (increment: boolean) => {
        const currentCols = getValues('boardCols') || 3
        const newValue = increment ? currentCols + 1 : currentCols - 1
        if (newValue >= 3 && newValue <= 10) {
            setValue('boardCols', newValue, { shouldValidate: true })
        }
    }

    const onSubmit = async (data: CustomizationFormData) => {
        try {
            onSave(data)
            onClose()
        } catch (error) {
            console.error('Error saving customization:', error)
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#121212] rounded-3xl p-8 w-full max-w-md mx-auto shadow-2xl border-4 border-black/20">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <IconParkSolidSettingTwo fontSize={32} className="text-warning" />
                        <h2 className="text-2xl font-bold ">Customize Game</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-[#202020] cursor-pointer rounded-full transition-colors"
                    >
                        <IcomoonFreeCross fontSize={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-3">Board Size</h3>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Rows: {watchedRows}
                            </label>
                            <div className="flex items-center gap-2">
                                <PlayfulButton
                                    variant={watchedRows <= 3 ? "disabled" : "secondary"}
                                    type="button"
                                    onClick={() => handleRowsChange(false)}
                                    disabled={watchedRows <= 3}
                                    className={`px-4 ${watchedCols <= 3 ? "cursor-not-allowed" : ""}`}
                                >
                                    -
                                </PlayfulButton>
                                <PlayfulInput
                                    type="number"
                                    min={3}
                                    {...register('boardRows', { valueAsNumber: true })}
                                    errMessage={errors.boardRows?.message}
                                    placeholder="Enter number of rows (3-10)"
                                    className="text-center"
                                />
                                <PlayfulButton
                                    variant={"primary"}
                                    type="button"
                                    onClick={() => handleRowsChange(true)}
                                    className="px-4"
                                >
                                    +
                                </PlayfulButton>
                            </div>

                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Columns: {watchedCols}
                            </label>
                            <div className="flex items-center gap-2">
                                <PlayfulButton
                                    variant={watchedCols <= 3 ? "disabled" : "secondary"}
                                    type="button"
                                    onClick={() => handleColsChange(false)}
                                    disabled={watchedCols <= 3}
                                    className={`px-4 ${watchedCols <= 3 ? "cursor-not-allowed" : ""}`}
                                >
                                    -
                                </PlayfulButton>
                                <PlayfulInput
                                    type="number"
                                    min={3}
                                    max={10}
                                    {...register('boardCols', { valueAsNumber: true })}
                                    errMessage={errors.boardCols?.message}
                                    placeholder="Enter number of columns (3-10)"
                                    className="text-center"
                                />
                                <PlayfulButton
                                    variant="primary"
                                    type="button"
                                    onClick={() => handleColsChange(true)}
                                    className="px-4"
                                >
                                    +
                                </PlayfulButton>
                            </div>

                        </div>

                        <div className="bg-gray-50 p-4 rounded-2xl">
                            <p className="text-sm mb-2 text-black">Board Preview:</p>
                            <div className="grid gap-1 w-fit mx-auto" style={{
                                gridTemplateColumns: `repeat(${watchedCols || 3}, 1fr)`
                            }}>
                                {Array.from({ length: (watchedRows || 3) * (watchedCols || 3) }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-6 h-6 bg-white border-2 border-gray-300 rounded-md"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-3">AI Difficulty</h3>

                        <div className="space-y-3">
                            {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                                <label key={difficulty} className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        value={difficulty}
                                        {...register('aiDifficulty')}
                                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium capitalize">
                                                {difficulty}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded-full ${difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                                difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {difficulty === 'easy' ? '⭐' :
                                                    difficulty === 'medium' ? '⭐⭐' : '⭐⭐⭐'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {difficulty === 'easy' ? 'Perfect for beginners' :
                                                difficulty === 'medium' ? 'Balanced challenge' :
                                                    'Maximum difficulty'}
                                        </p>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {errors.aiDifficulty && (
                            <p className="text-red-500 text-xs mt-1">*{errors.aiDifficulty.message}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <PlayfulButton
                            type="button"
                            onClick={handleClose}
                            variant="danger"
                            size="lg"
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </PlayfulButton>
                        <PlayfulButton
                            type="submit"
                            variant="success"
                            size="lg"
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Settings'}
                        </PlayfulButton>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CustomizeModal
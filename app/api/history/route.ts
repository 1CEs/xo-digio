import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/database/connect'
import User from '@/database/schema/user.schema'
import { verifyToken } from '@/lib/auth-middleware'
import { ApiResponseHelper } from '@/lib/api-response'
import { IHistory } from '@/database/schema/user.interface'

export async function GET(request: NextRequest) {
    try {
        const authResult = await verifyToken(request)
        if (!authResult.success) {
            return ApiResponseHelper.error('Unauthorized', 401)
        }

        await connectDB()
        const user = await User.findById(authResult.userId).select('history')
        
        if (!user) {
            return ApiResponseHelper.error('User not found', 404)
        }

        const sortedHistory = user.history.sort((a: IHistory, b: IHistory) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )

        return ApiResponseHelper.success(sortedHistory)
    } catch (error) {
        console.error('History fetch error:', error)
        return ApiResponseHelper.error('Internal server error', 500)
    }
}

export async function POST(request: NextRequest) {
    try {
        const authResult = await verifyToken(request)
        if (!authResult.success) {
            return ApiResponseHelper.error('Unauthorized', 401)
        }

        const body = await request.json()
        const { gameStatus, winner, gameSetting, moves } = body

        await connectDB()
        const user = await User.findById(authResult.userId)
        
        if (!user) {
            return ApiResponseHelper.error('User not found', 404)
        }

        const newHistory = {
            id: `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            gameStatus,
            winner,
            gameSetting,
            moves,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        user.history.push(newHistory)
        await user.save()

        return ApiResponseHelper.success(newHistory)
    } catch (error) {
        console.error('History save error:', error)
        return ApiResponseHelper.error('Internal server error', 500)
    }
}

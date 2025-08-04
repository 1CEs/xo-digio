import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { ApiResponseHelper } from '@/lib/api-response';

export async function POST(request: NextRequest) {
    try {
        const response = ApiResponseHelper.success(null, 'Sign out successful');
        
        const cookieOptions = [
            'auth-token=',
            'HttpOnly',
            'Secure',
            'SameSite=Strict',
            'Path=/',
            'Max-Age=0'
        ].join('; ');

        response.headers.set('Set-Cookie', cookieOptions);

        return response;

    } catch (error) {
        console.error('Sign out error:', error);
        return ApiResponseHelper.serverError('An error occurred during sign out');
    }
}

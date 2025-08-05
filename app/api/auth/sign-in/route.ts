import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import bcrypt from 'bcryptjs';
import { signInSchema } from '@/validation/form';
import { ApiResponseHelper } from '@/lib/api-response';
import { JWTHelper } from '@/lib/jwt';
import connectDB from '@/database/connect';
import User from '@/database/schema/user.schema';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const validation = signInSchema.safeParse(body);
        if (!validation.success) {
            const errors = validation.error.issues.map((err: any) => ({
                field: err.path[0] as string,
                message: err.message
            }));
            return ApiResponseHelper.validationError(errors);
        }

        const { usernameOrEmail, password } = validation.data;

        const user = await User.findOne({
            $or: [
                { username: usernameOrEmail },
                { email: usernameOrEmail.toLowerCase() }
            ]
        });

        if (!user) {
            return ApiResponseHelper.error('Invalid credentials', 401);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return ApiResponseHelper.error('Invalid credentials', 401);
        }

        const token = await JWTHelper.generateToken({
            userId: user._id.toString(),
            username: user.username,
            email: user.email
        });

        const userData = {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        const response = ApiResponseHelper.success(userData, 'Sign in successful');
        
        const cookieOptions = [
            `auth-token=${token}`,
            'HttpOnly',
            'Secure',
            'SameSite=Strict',
            'Path=/',
            `Max-Age=${12 * 60 * 60}`
        ].join('; ');

        response.headers.set('Set-Cookie', cookieOptions);

        return response;

    } catch (error) {
        console.error('Sign in error:', error);
        return ApiResponseHelper.serverError('An error occurred during sign in');
    }
}

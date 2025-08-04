import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { signUpSchema } from "@/validation/form";
import connectDB from "@/database/connect";
import User from "@/database/schema/user.schema";
import { ZodError } from "zod";
import { ApiResponseHelper } from "@/lib/api-response";
import { JWTHelper } from '@/lib/jwt';

export async function POST(request: NextRequest) {
    try {
        // Check if MongoDB URI is configured
        if (!process.env.MONGODB_URI) {
            console.error("MongoDB URI not configured");
            return ApiResponseHelper.serverError("Database configuration error");
        }

        await connectDB();
        const body = await request.json();
        const validatedData = signUpSchema.parse(body);
        const { username, email, password } = validatedData;

        const existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { username: username }
            ]
        });

        if (existingUser) {
            if (existingUser.email === email.toLowerCase()) {
                return ApiResponseHelper.conflict("User with this email already exists");
            }
            if (existingUser.username === username) {
                return ApiResponseHelper.conflict("Username is already taken");
            }
        }

        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username,
            email: email.toLowerCase(),
            password: hashedPassword,
            avatar: '',
            history: []
        });

        const savedUser = await newUser.save();

        // Generate JWT token for automatic login
        const token = JWTHelper.generateToken({
            userId: savedUser._id.toString(),
            username: savedUser.username,
            email: savedUser.email
        });

        const userResponse = {
            id: savedUser._id.toString(),
            username: savedUser.username,
            email: savedUser.email,
            avatar: savedUser.avatar,
            createdAt: savedUser.createdAt,
            updatedAt: savedUser.updatedAt
        };

        const response = ApiResponseHelper.created(userResponse, "User created successfully");
        
        // Set authentication cookie
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
        console.error("Sign-up error:", error);

        if (error instanceof ZodError) {
            const fieldErrors = error.issues.map((err: any) => ({
                field: err.path.join('.'),
                message: err.message
            }));

            return ApiResponseHelper.validationError(fieldErrors);
        }

        if (error instanceof Error && 'code' in error && error.code === 11000) {
            const duplicateField = Object.keys((error as any).keyPattern)[0];
            return ApiResponseHelper.conflict(
                `${duplicateField === 'email' ? 'Email' : 'Username'} already exists`
            );
        }

        return ApiResponseHelper.serverError();
    }
}

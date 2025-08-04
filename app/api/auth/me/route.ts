
import { ApiResponseHelper } from '@/lib/api-response';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import connectDB from '@/database/connect';
import User from '@/database/schema/user.schema';

async function handler(request: AuthenticatedRequest) {
    try {
        await connectDB();

        const user = await User.findById(request.user.userId).select('-password');
        
        if (!user) {
            return ApiResponseHelper.error('User not found', 404);
        }

        const userData = {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        return ApiResponseHelper.success(userData, 'User data retrieved successfully');

    } catch (error) {
        console.error('Get user error:', error);
        return ApiResponseHelper.serverError('An error occurred while retrieving user data');
    }
}

export const GET = requireAuth(handler);

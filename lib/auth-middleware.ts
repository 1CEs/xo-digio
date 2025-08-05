import { NextRequest } from 'next/server';
import { JWTHelper, JWTPayload } from './jwt';

export function getAuthToken(request: NextRequest): string | null {
  const cookieToken = request.cookies.get('auth-token')?.value;
  if (cookieToken) {
    return cookieToken;
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

export async function verifyAuthToken(request: NextRequest): Promise<JWTPayload | null> {
  const token = getAuthToken(request);
  if (!token) {
    return null;
  }

  return await JWTHelper.verifyToken(token);
}

export interface AuthenticatedRequest extends NextRequest {
  user: JWTPayload;
}

export async function verifyToken(request: NextRequest): Promise<{ success: boolean; userId?: string; message?: string }> {
  try {
    const payload = await verifyAuthToken(request);
    if (!payload) {
      return { success: false, message: 'Invalid or missing token' };
    }
    return { success: true, userId: payload.userId };
  } catch (error) {
    return { success: false, message: 'Token verification failed' };
  }
}

export function requireAuth(handler: (request: AuthenticatedRequest) => Promise<Response>) {
  return async (request: NextRequest): Promise<Response> => {
    const user = await verifyAuthToken(request);
    
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Authentication required'
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = user;

    return handler(authenticatedRequest);
  };
}

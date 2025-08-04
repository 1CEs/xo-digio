
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: User;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export class AuthClient {
  private static readonly API_BASE = '/api/auth';

  static async signIn(usernameOrEmail: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_BASE}/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          usernameOrEmail,
          password
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }

  static async signOut(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_BASE}/sign-out`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }

  static async getCurrentUser(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_BASE}/me`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }

  static async signUp(username: string, email: string, password: string, confirmPassword: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_BASE}/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }
}

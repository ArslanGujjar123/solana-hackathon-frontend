const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface LoginCredentials {
  username: string;  // email
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  full_name?: string;
}

interface User {
  email: string;
  full_name?: string;
  disabled?: boolean;
  role: string;
}

interface LoginResponse {
  message: string;
  expires_in: number;
}

interface VerifyResponse {
  valid: boolean;
  user?: string;
  message?: string;
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      credentials: 'include',  // Important for cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'An error occurred');
    }

    return response.json();
  }

  async register(data: RegisterData): Promise<{ message: string }> {
    console.log("Registering user with data:", data);
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Login failed');
    }

    return response.json();
  }

  async logout(): Promise<{ message: string }> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request('/auth/me');
  }

  async getProtectedData(): Promise<{ message: string; token_expires_in: string }> {
    return this.request('/api/protected');
  }

  async verifyToken(): Promise<VerifyResponse> {
    return this.request('/auth/verify');
  }
}

export const api = new ApiClient();
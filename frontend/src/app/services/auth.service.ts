import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User, AuthResponse, LoginRequest, SignupRequest } from '../models/models';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private token = signal<string | null>(null);

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUser());

  constructor(private router: Router) {
    // Restore session from localStorage
    const savedUser = localStorage.getItem('gs_user');
    const savedToken = localStorage.getItem('gs_token');
    if (savedUser && savedToken) {
      this.currentUser.set(JSON.parse(savedUser));
      this.token.set(savedToken);
    }
  }

  /**
   * Login — currently uses mock data.
   * TODO: Replace with HttpClient.post(`${environment.apiUrl}/auth/login`, credentials)
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock response — replace with actual API call
    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: '1',
        name: 'User',
        email: credentials.email,
        avatar: undefined,
      },
    };

    this.setSession(mockResponse);
    return mockResponse;
  }

  /**
   * Sign up — currently uses mock data.
   * TODO: Replace with HttpClient.post(`${environment.apiUrl}/auth/signup`, data)
   */
  async signup(data: SignupRequest): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: '1',
        name: data.name,
        email: data.email,
        avatar: undefined,
      },
    };

    this.setSession(mockResponse);
    return mockResponse;
  }

  logout(): void {
    this.currentUser.set(null);
    this.token.set(null);
    localStorage.removeItem('gs_user');
    localStorage.removeItem('gs_token');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.token();
  }

  private setSession(response: AuthResponse): void {
    this.currentUser.set(response.user);
    this.token.set(response.token);
    localStorage.setItem('gs_user', JSON.stringify(response.user));
    localStorage.setItem('gs_token', response.token);
  }
}

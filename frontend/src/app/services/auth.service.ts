import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { User, AuthResponse, LoginRequest, SignupRequest } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private token = signal<string | null>(null);

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUser());

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
    // Restore session from localStorage
    const savedUser = localStorage.getItem('gs_user');
    const savedToken = localStorage.getItem('gs_token');
    if (savedUser && savedToken) {
      this.currentUser.set(JSON.parse(savedUser));
      this.token.set(savedToken);
    }
  }

  /**
   * Login via backend POST /auth/login
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials),
    );

    this.setSession(response);
    return response;
  }

  /**
   * Sign up via backend POST /auth/signup
   */
  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(`${environment.apiUrl}/auth/signup`, data),
    );

    this.setSession(response);
    return response;
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

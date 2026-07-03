import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthResult } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly #http = inject(HttpClient);
  readonly #router = inject(Router);
  readonly #apiUrl = `${environment.apiUrl}/auth`;
  readonly #tokenKey = 'allSportsToken';

  readonly #token = signal<string | null>(this.#readStoredToken());

  readonly isAuthenticated = computed(() => !!this.#token());

  readonly currentUserEmail = computed<string | null>(() => {
    const token = this.#token();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as Record<string, unknown>;
      return (payload['email'] as string) ?? null;
    } catch {
      return null;
    }
  });

  login(email: string, password: string): Observable<AuthResult> {
    return this.#http
      .post<AuthResult>(`${this.#apiUrl}/login`, { email, password })
      .pipe(tap(r => this.#storeToken(r.token)));
  }

  register(email: string, password: string): Observable<AuthResult> {
    return this.#http
      .post<AuthResult>(`${this.#apiUrl}/register`, { email, password })
      .pipe(tap(r => this.#storeToken(r.token)));
  }

  logout(): void {
    this.#token.set(null);
    localStorage.removeItem(this.#tokenKey);
    void this.#router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.#token();
  }

  #storeToken(token: string): void {
    this.#token.set(token);
    localStorage.setItem(this.#tokenKey, token);
  }

  #readStoredToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(this.#tokenKey);
  }
}

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

  readonly #token = signal<string | null>(this.#initialToken());

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
    return this.#http.post<AuthResult>(`${this.#apiUrl}/register`, { email, password }).pipe(
      tap(r => {
        // No token when Supabase still needs the email confirmed.
        if (r.token) this.#storeToken(r.token);
      }),
    );
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

  #initialToken(): string | null {
    return this.#consumeConfirmationToken() ?? this.#readStoredToken();
  }

  /**
   * Supabase email-confirmation links redirect back with the session in the
   * URL fragment (#access_token=…&type=signup). Consume it so clicking the
   * link signs the user straight in instead of dropping them on the login page.
   */
  #consumeConfirmationToken(): string | null {
    if (typeof window === 'undefined') return null;

    const hash = window.location.hash;
    if (!hash.includes('access_token=')) return null;

    const token = new URLSearchParams(hash.slice(1)).get('access_token');
    if (!token) return null;

    localStorage.setItem(this.#tokenKey, token);
    history.replaceState(null, '', window.location.pathname + window.location.search);
    return token;
  }

  #readStoredToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(this.#tokenKey);
  }
}

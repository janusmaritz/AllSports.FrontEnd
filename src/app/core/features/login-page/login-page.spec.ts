import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { LoginPage } from './login-page';
import { AuthResult } from '../../models/auth.model';
import { AuthService } from '../../services/auth.service';

const sessionResult: AuthResult = {
  token: 'jwt-token',
  expiresAt: '2026-07-04T12:00:00Z',
  email: 'user@example.com',
  role: 'authenticated',
};

const confirmationResult: AuthResult = {
  token: '',
  expiresAt: '2026-07-04T12:00:00Z',
  email: 'new@example.com',
  role: 'authenticated',
  requiresEmailConfirmation: true,
};

describe('LoginPage', () => {
  let fixture: ComponentFixture<LoginPage>;
  let loginResponse: () => Observable<AuthResult>;
  let registerResponse: () => Observable<AuthResult>;

  const el = <T extends HTMLElement>(selector: string): T | null =>
    (fixture.nativeElement as HTMLElement).querySelector<T>(selector);

  const setInput = (selector: string, value: string) => {
    const input = el<HTMLInputElement>(selector)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  };

  const fillAndSubmit = async (email: string, password: string) => {
    setInput('#email', email);
    setInput('#password', password);
    el<HTMLButtonElement>('.submit-btn')!.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    loginResponse = () => of(sessionResult);
    registerResponse = () => of(sessionResult);

    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        provideRouter([{ path: '**', component: LoginPage }]),
        {
          provide: AuthService,
          useValue: {
            isAuthenticated: signal(false),
            login: () => loginResponse(),
            register: () => registerResponse(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
  });

  const switchToRegister = () => {
    el<HTMLButtonElement>('.toggle-btn')!.click();
    fixture.detectChanges();
  };

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show a validation error when fields are empty', () => {
    el<HTMLButtonElement>('.submit-btn')!.click();
    fixture.detectChanges();

    expect(el('.error-banner')?.textContent).toContain('Please fill in all fields.');
  });

  it('should show the confirmation banner and switch to login mode after registering', async () => {
    registerResponse = () => of(confirmationResult);
    switchToRegister();

    await fillAndSubmit('new@example.com', 'Password1!');

    expect(el('.info-banner')?.textContent).toContain('confirmation link to new@example.com');
    expect(el('.submit-btn')?.textContent).toContain('Sign in');
  });

  it('should show invalid-credentials message on 401 login failure', async () => {
    loginResponse = () => throwError(() => ({ status: 401 }));

    await fillAndSubmit('user@example.com', 'wrong');

    expect(el('.error-banner')?.textContent).toContain('Invalid email or password.');
  });

  it('should show a generic message on non-401 login failure', async () => {
    loginResponse = () => throwError(() => ({ status: 500 }));

    await fillAndSubmit('user@example.com', 'Password1!');

    expect(el('.error-banner')?.textContent).toContain('Unable to sign in right now');
  });

  it('should surface the backend message on registration failure', async () => {
    registerResponse = () => throwError(() => ({ status: 409, error: { message: 'Email is already registered.' } }));
    switchToRegister();

    await fillAndSubmit('existing@example.com', 'Password1!');

    expect(el('.error-banner')?.textContent).toContain('Email is already registered.');
  });
});

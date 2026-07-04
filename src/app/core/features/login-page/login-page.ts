import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, Eye, EyeOff, Lock, LogIn, Mail, MailCheck, UserPlus } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { AuthResult } from '../../models/auth.model';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  readonly #auth = inject(AuthService);
  readonly #router = inject(Router);

  protected readonly mailIcon = Mail;
  protected readonly mailCheckIcon = MailCheck;
  protected readonly lockIcon = Lock;
  protected readonly eyeIcon = Eye;
  protected readonly eyeOffIcon = EyeOff;
  protected readonly loginIcon = LogIn;
  protected readonly userPlusIcon = UserPlus;

  protected readonly mode = signal<'login' | 'register'>('login');
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly error = signal('');
  protected readonly info = signal('');
  protected readonly loading = signal(false);
  protected readonly showPassword = signal(false);

  protected readonly isLogin = computed(() => this.mode() === 'login');

  constructor() {
    effect(() => {
      if (this.#auth.isAuthenticated()) {
        void this.#router.navigate(['/players']);
      }
    });
  }

  protected onEmailInput(e: Event): void {
    this.email.set((e.target as HTMLInputElement).value);
  }

  protected onPasswordInput(e: Event): void {
    this.password.set((e.target as HTMLInputElement).value);
  }

  protected toggleShowPassword(): void {
    this.showPassword.update(v => !v);
  }

  protected toggleMode(): void {
    this.mode.update(m => (m === 'login' ? 'register' : 'login'));
    this.error.set('');
    this.info.set('');
  }

  protected submit(): void {
    if (!this.email() || !this.password()) {
      this.error.set('Please fill in all fields.');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.info.set('');

    const call = this.isLogin()
      ? this.#auth.login(this.email(), this.password())
      : this.#auth.register(this.email(), this.password());

    call.subscribe({
      next: result => this.#onAuthSuccess(result),
      error: (err: { status?: number; error?: { message?: string } }) => {
        this.loading.set(false);
        if (this.isLogin()) {
          this.error.set(
            err?.status === 401
              ? 'Invalid email or password.'
              : 'Unable to sign in right now. Please try again.',
          );
        } else {
          this.error.set(err?.error?.message ?? 'Registration failed. Please try again.');
        }
      },
    });
  }

  #onAuthSuccess(result: AuthResult): void {
    this.loading.set(false);

    if (result.requiresEmailConfirmation) {
      this.mode.set('login');
      this.password.set('');
      this.info.set(
        `Almost there! We've sent a confirmation link to ${result.email || this.email()}. ` +
          'Click it, then sign in below.',
      );
      return;
    }

    void this.#router.navigate(['/players']);
  }
}

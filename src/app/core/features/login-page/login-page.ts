import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, Eye, EyeOff, Lock, LogIn, Mail, UserPlus } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';

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
  protected readonly lockIcon = Lock;
  protected readonly eyeIcon = Eye;
  protected readonly eyeOffIcon = EyeOff;
  protected readonly loginIcon = LogIn;
  protected readonly userPlusIcon = UserPlus;

  protected readonly mode = signal<'login' | 'register'>('login');
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly error = signal('');
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
  }

  protected submit(): void {
    if (!this.email() || !this.password()) {
      this.error.set('Please fill in all fields.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const call = this.isLogin()
      ? this.#auth.login(this.email(), this.password())
      : this.#auth.register(this.email(), this.password());

    call.subscribe({
      next: () => void this.#router.navigate(['/players']),
      error: (err: { error?: { message?: string } }) => {
        this.loading.set(false);
        if (this.isLogin()) {
          this.error.set('Invalid email or password.');
        } else {
          this.error.set(err?.error?.message ?? 'Registration failed. Please try again.');
        }
      },
    });
  }
}

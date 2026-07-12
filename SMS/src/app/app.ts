import { NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, HttpClientModule, MatSnackBarModule, NgIf, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SMS');
  protected readonly showPassword = signal(false);
  protected readonly isLoading = signal(false);

  protected readonly router = inject(Router);

  loginData = {
    email: '',
    password: ''
  };

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  isLoginRoute(): boolean {
    return this.router.url === '/' || this.router.url === '/login';
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }

  onLoginSave() {
    if (this.isLoading()) return; // Prevent multiple submissions

    const apiURL = 'http://localhost:5203/api/auth/login';

    this.isLoading.set(true);

    this.http.post(apiURL, this.loginData).subscribe({
      next: (response: any) => {
        this.isLoading.set(false);
        this.snackBar.open('Login successful!', 'Close', {
          duration: 3000,
        });

        this.router.navigate(['/dashboard']);
      },

      error: (err: any) => {
        this.isLoading.set(false);
        this.snackBar.open('Invalid email or password!', 'Close', {
          duration: 3000,
        });

        console.error(err);
      }
    });
  }
}
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { IUser } from '../../interfaces/user.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Regex } from '../../enums/regex.enum';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  error: string | null = null;

  form = this.fb.nonNullable.group({
    username: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    password: this.fb.control('', {
      validators: [Validators.required, Validators.pattern(Regex.PASSWORD)],
    }),
  });

  onSubmit(): void {
    const userData: Partial<IUser> = this.form.getRawValue();
    this.authService.loginUser(userData).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.authService.currentUserSig.set(response.user);
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        this.error = error.message;
      },
    });
  }
}

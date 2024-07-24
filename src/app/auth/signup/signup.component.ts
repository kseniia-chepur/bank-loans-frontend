import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IUser } from '../../interfaces/user.interface';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Roles } from '../../enums/roles.enum';
import { CommonModule } from '@angular/common';
import { Regex } from '../../enums/regex.enum';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  error: string | null = null;

  form = this.fb.nonNullable.group({
    email: this.fb.control('', {
      validators: [Validators.required, Validators.email],
    }),
    username: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    password: this.fb.control('', {
      validators: [Validators.required, Validators.pattern(Regex.PASSWORD)],
    }),
    role: this.fb.control(Roles.SPECIALIST),
  });

  onSubmit(): void {
    const newUserData: Partial<IUser> = this.form.getRawValue();
    this.authService.createUser(newUserData).subscribe({
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

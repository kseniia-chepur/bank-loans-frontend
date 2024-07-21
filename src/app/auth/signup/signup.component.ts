import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { IUser } from '../../interfaces/user.interface';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Roles } from '../../enums/roles.enum';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatError,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);

  email = new FormControl('', [Validators.required, Validators.email]);

  username = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/),
  ]);

  role = new FormControl(Roles.specialist);

  form = this.fb.nonNullable.group({
    email: this.email,
    username: this.username,
    password: this.password,
    role: this.role,
  });

  onSubmit(): void {
    this.http
      .post<{ status: string; user: IUser; token: string }>(
        `${environment.BASE_API_URL}/auth/signup`,
        this.form.getRawValue()
      )
      .subscribe((res) => {
        localStorage.setItem('token', res.token);
        this.authService.currentUserSig.set(res.user);
        this.router.navigateByUrl('/');
      });
  }
}

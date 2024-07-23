import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { environment } from '../../../environments/environment';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);

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

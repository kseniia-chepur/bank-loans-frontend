import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthService } from './auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { IUser } from './interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    SignupComponent,
    LoginComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);
  http = inject(HttpClient);

  ngOnInit(): void {
    this.http
      .get<{ status: string; user: IUser }>(
        `${environment.BASE_API_URL}/auth/cabinet`
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.authService.currentUserSig.set(res.user);
        },
        error: (error) => {
          console.log(error);
          this.authService.currentUserSig.set(null);
        },
      });
  }

  logout(): void {
    localStorage.setItem('token', '');
    this.authService.currentUserSig.set(null);
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthService } from './auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    SignupComponent,
    LoginComponent,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (res) => this.authService.currentUserSig.set(res.user),
      error: () => this.authService.currentUserSig.set(null),
    });
  }

  logout(): void {
    localStorage.setItem('token', '');
    this.authService.currentUserSig.set(null);
  }
}

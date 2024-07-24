import { inject, Injectable, signal } from '@angular/core';
import { IUser } from '../../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ErrorMsg } from '../../enums/errorMsg.enum';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.BASE_API_URL}/auth`;

  currentUserSig = signal<IUser | undefined | null>(undefined);

  createUser(
    user: Partial<IUser>
  ): Observable<{ status: string; user: IUser; token: string }> {
    return this.http
      .post<{ status: string; user: IUser; token: string }>(
        `${this.apiUrl}/signup`,
        user
      )
      .pipe(
        catchError(() => throwError(() => new Error(ErrorMsg.FAILED_TO_CREATE)))
      );
  }

  loginUser(
    user: Partial<IUser>
  ): Observable<{ status: string; user: IUser; token: string }> {
    return this.http
      .post<{ status: string; user: IUser; token: string }>(
        `${this.apiUrl}/login`,
        user
      )
      .pipe(
        catchError(() => throwError(() => new Error(ErrorMsg.FAILED_TO_LOGIN)))
      );
  }

  getUser(): Observable<{ status: string; user: IUser }> {
    return this.http.get<{ status: string; user: IUser }>(
      `${this.apiUrl}/cabinet`
    );
  }
}

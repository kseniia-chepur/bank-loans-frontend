import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorMsg } from '../../enums/errorMsg.enum';
import { ILoan } from '../../interfaces/loan.interface';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.BASE_API_URL}/loans`;

  createLoan(
    loan: Partial<ILoan>
  ): Observable<{ status: string; loan: ILoan }> {
    return this.http
      .post<{ status: string; loan: ILoan }>(this.apiUrl, loan)
      .pipe(
        catchError(() => throwError(() => new Error(ErrorMsg.FAILED_TO_CREATE)))
      );
  }

  getLoans(): Observable<{ status: string; loans: ILoan[] }> {
    return this.http
      .get<{ status: string; loans: ILoan[] }>(this.apiUrl)
      .pipe(
        catchError(() => throwError(() => new Error(ErrorMsg.FAILED_TO_FETCH)))
      );
  }

  getLoanById(id: string): Observable<{ status: string; loan: ILoan }> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<{ status: string; loan: ILoan }>(url)
      .pipe(
        catchError(() =>
          throwError(() => new Error(`${ErrorMsg.FAILED_TO_FETCH_BY_ID} ${id}`))
        )
      );
  }

  updateLoan(
    id: string,
    dateRepaid: Date
  ): Observable<{ status: string; loan: ILoan }> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .patch<{ status: string; loan: ILoan }>(url, { dateRepaid })
      .pipe(
        catchError(() =>
          throwError(
            () => new Error(`${ErrorMsg.FAILED_TO_UPDATE_BY_ID} ${id}`)
          )
        )
      );
  }

  deleteLoan(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .delete<void>(url)
      .pipe(
        catchError(() =>
          throwError(
            () =>
              new Error(
                `${ErrorMsg.FAILED_TO_DELETE_BY_ID} ${id}. ${ErrorMsg.DELETE_LOAN_INFO}`
              )
          )
        )
      );
  }
}

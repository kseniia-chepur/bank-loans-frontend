import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorMsg } from '../../enums/errorMsg.enum';
import { ILoanType } from '../../interfaces/loantype.interface';

@Injectable({
  providedIn: 'root',
})
export class LoantypeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.BASE_API_URL}/loantypes`;

  createLoantype(
    loantype: Partial<ILoanType>
  ): Observable<{ status: string; ['loan type']: ILoanType }> {
    return this.http
      .post<{ status: string; ['loan type']: ILoanType }>(this.apiUrl, loantype)
      .pipe(
        catchError(() => throwError(() => new Error(ErrorMsg.FAILED_TO_CREATE)))
      );
  }

  getLoantypes(): Observable<{ status: string; ['loan types']: ILoanType[] }> {
    return this.http
      .get<{ status: string; ['loan types']: ILoanType[] }>(this.apiUrl)
      .pipe(
        catchError(() => throwError(() => new Error(ErrorMsg.FAILED_TO_FETCH)))
      );
  }

  getLoantypeById(
    id: string
  ): Observable<{ status: string; ['loan type']: ILoanType }> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<{ status: string; ['loan type']: ILoanType }>(url)
      .pipe(
        catchError(() =>
          throwError(() => new Error(`${ErrorMsg.FAILED_TO_FETCH_BY_ID} ${id}`))
        )
      );
  }

  updateLoantype(
    id: string,
    loantype: Partial<ILoanType>
  ): Observable<{ status: string; ['loan type']: ILoanType }> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .patch<{ status: string; ['loan type']: ILoanType }>(url, loantype)
      .pipe(
        catchError(() =>
          throwError(
            () => new Error(`${ErrorMsg.FAILED_TO_UPDATE_BY_ID} ${id}`)
          )
        )
      );
  }

  deleteLoantype(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .delete<void>(url)
      .pipe(
        catchError(() =>
          throwError(
            () =>
              new Error(
                `${ErrorMsg.FAILED_TO_DELETE_BY_ID} ${id}. ${ErrorMsg.DELETE_LOANTYPE_INFO}`
              )
          )
        )
      );
  }
}

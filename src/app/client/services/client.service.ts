import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IClient } from '../../interfaces/client.interface';
import { ErrorMsg } from '../../enums/errorMsg.enum';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.BASE_API_URL}/clients`;

  createClient(
    client: Partial<IClient>
  ): Observable<{ status: string; client: IClient }> {
    return this.http
      .post<{ status: string; client: IClient }>(this.apiUrl, client)
      .pipe(
        catchError(() => throwError(() => new Error(ErrorMsg.FAILED_TO_CREATE)))
      );
  }

  getClients(): Observable<{ status: string; clients: IClient[] }> {
    return this.http
      .get<{ status: string; clients: IClient[] }>(this.apiUrl)
      .pipe(
        catchError(() => throwError(() => new Error(ErrorMsg.FAILED_TO_FETCH)))
      );
  }

  getClientById(id: string): Observable<{ status: string; client: IClient }> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<{ status: string; client: IClient }>(url)
      .pipe(
        catchError(() =>
          throwError(() => new Error(`${ErrorMsg.FAILED_TO_FETCH_BY_ID} ${id}`))
        )
      );
  }

  updateClient(
    id: string,
    client: Partial<IClient>
  ): Observable<{ status: string; client: IClient }> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .patch<{ status: string; client: IClient }>(url, client)
      .pipe(
        catchError(() =>
          throwError(
            () => new Error(`${ErrorMsg.FAILED_TO_UPDATE_BY_ID} ${id}`)
          )
        )
      );
  }

  deleteClient(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .delete<void>(url)
      .pipe(
        catchError(() =>
          throwError(
            () => new Error(`${ErrorMsg.FAILED_TO_DELETE_BY_ID} ${id}. ${ErrorMsg.DELETE_CLIENT_INFO}`)
          )
        )
      );
  }
}

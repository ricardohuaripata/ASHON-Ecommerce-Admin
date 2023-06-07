import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from 'src/environments/environment.development';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private serverUrl: string;
  private apiUrl: string;

  constructor(private http: HttpClient) { 
    this.serverUrl = environment.serverURL;
    this.apiUrl = 'api/auth'
  }

  login(user: User): Observable<string> {
    return this.http.post<string>(this.serverUrl + this.apiUrl + '/login', user);
  }

  validateToken(token: string): Observable<boolean> {
    return this.http.post<any>(this.serverUrl + this.apiUrl + '/auth-token', { token }).pipe(
      map((response: any) => {
        return response.type === 'Success' && response.user.role === 'admin';
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Token validation error:', error);
        return throwError('Token validation error');
      })
    );
  }

  logout(refreshToken: string): Observable<string> {
    const body = {
      refreshToken,
    };
    return this.http.post<string>(
      this.serverUrl + this.apiUrl + '/logout',
      body
    );
  }

}

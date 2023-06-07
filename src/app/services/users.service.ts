import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private serverUrl: string;
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.serverUrl = environment.serverURL;
    this.apiUrl = 'api/user';
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(this.serverUrl + this.apiUrl);
  }
}

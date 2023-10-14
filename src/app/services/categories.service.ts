import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Category } from '../interfaces/category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private serverUrl: string;
  private apiUrl: string;

  constructor(private http: HttpClient) { 
    this.serverUrl = environment.serverURL;
    this.apiUrl = 'api/category/';
  }

  getCategories(params: HttpParams): Observable<any> {
    return this.http.get<any>(this.serverUrl + this.apiUrl, { params });
  }

  addCategory(categoryData: FormData): Observable<any> {
    return this.http.post<any>(this.serverUrl + this.apiUrl, categoryData);
  }

  deleteCategory(categoryId: string): Observable<any> {
    return this.http.delete<any>(this.serverUrl + this.apiUrl + categoryId);
  }

}

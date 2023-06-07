import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';
import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private serverUrl: string;
  private apiUrl: string;

  constructor(private http: HttpClient) {
    // URL del servidor backend
    this.serverUrl = environment.serverURL;
    this.apiUrl = 'api/product/';
  }

  getProducts(): Observable<any> {
    return this.http.get<any>(this.serverUrl + this.apiUrl);
  }
  
  addProduct(productData: FormData): Observable<any> {
    return this.http.post<any>(this.serverUrl + this.apiUrl, productData);
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete<any>(this.serverUrl + this.apiUrl + productId);
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  base = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}

  getProducts(){
    return this.http.get<any[]>(`${this.base}/products`).toPromise();
  }

  createProduct(formData: FormData){
    return this.http.post<any>(`${this.base}/products/`, formData).toPromise();
  }

  createMockProducts(){
    return this.http.post(`${this.base}/products/mock`, {}).toPromise();
  }

  createOrder(payload: any){
    return this.http.post(`${this.base}/orders`, payload).toPromise();
  }

  // Cart endpoints
  getCart(){
    return this.http.get<any>(`${this.base}/cart`).toPromise();
  }

  addToCart(product_id: number, quantity: number = 1){
    return this.http.post(`${this.base}/cart/items`, { product_id, quantity }).toPromise();
  }

  removeFromCart(product_id: number){
    return this.http.delete(`${this.base}/cart/items/${product_id}`).toPromise();
  }

  getOrdersByEmail(email: string){
    return this.http.get<any[]>(`${this.base}/orders?email=${encodeURIComponent(email)}`).toPromise();
  }
}

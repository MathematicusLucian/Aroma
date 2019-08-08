import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators'; 
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs'; 

import { HttpClient } from '@angular/common/http';

import { Product } from "../models/product.model";
import { CachingService } from "./caching.service"; 
 
@Injectable({
  providedIn: 'root'
})
export class DataService extends CachingService {

  private apiUrl = 'https://api.exchangeratesapi.io/';
  
  private products: Observable<Product[]>; 
  private exchangeRates: Observable<any[]>; 

  public constructor(private http: HttpClient) {
    super();
  }

  public getProducts(): Observable<Product[]> {

    return this.cache<Product[]>(() => this.products,
      (val: Observable<Product[]>) => this.products = val,
      () => this.http
        .get("./assets/json/products.json")
          .pipe(map((response) => response as Product[] || [])
        )
    );

  }

  public getExchangeRates(): Observable<any[]> {

    return this.cache<any[]>(() => this.exchangeRates,
      (val: Observable<any[]>) => this.exchangeRates = val,
      () => this.http
        .get(this.apiUrl + "latest?base=GBP")
          .pipe(map((response) => response as any[] || [])
        )
    );

  }
  
	public getExchangeRate(currency): Observable<any[]> {   
    let data = this.http.get<any[]>(this.apiUrl + 'latest?base=GBP')
    .pipe(map(data => data["rates"][currency])); 
    //console.log(data);
    return data;
  } 
}
import { Injectable } from '@angular/core';

/** rxjs */
import { map } from 'rxjs/operators'; 
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs'; 

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

/** models */
import { Product } from "../models/product.model"; 

/** services */
import { CachingService } from "./caching.service"; 
 
@Injectable({
  providedIn: 'root'
})
export class DataService extends CachingService {

  //Url for exchange rates data
  private apiUrl = 'https://api.exchangeratesapi.io/';
  
  //products observable
  private products: Observable<Product[]>;  

  //we need to set up the HTTP client
  public constructor(private http: HttpClient) {
    super();
  }

  public getProducts(): Observable<Product[]> {

    //api call
    //HTTP GET request to local 'products.json' file for latest products

    return this.cache<Product[]>(() => this.products,
      (val: Observable<Product[]>) => this.products = val, //Observable
      () => this.http
        .get("./assets/json/products.json")
          //map the response as per the Product model
          .pipe(map((response) => response as Product[] || []))
    );

  }
  public getExchangeRates() {

    //api call
    //HTTP GET request to global apiUrl for latest exchange rates to GBP

    return this.http
      .get<any>(this.apiUrl + "latest?base=GBP")
      .pipe(map(data => data))
      .catch(this.errorHandler); 

  } 

  //error handler for api call
  private errorHandler(error: HttpErrorResponse){
    return Observable.throw(error.message) || "Server error";
  }

}
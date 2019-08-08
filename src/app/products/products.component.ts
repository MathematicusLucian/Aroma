import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observer, Observable, Subscription } from "rxjs";

import { DataService } from '../services/data.service'; 
import { BasketService } from '../services/basket.service'; 
import { Product } from "../models/product.model";
import { Basket } from "../models/basket.model"; 

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy { 
  public products: Product[]; 
  public basket: Observable<Basket>;
  public itemCount: number;
  private basketSubscription: Subscription;
  public currency: any;

  constructor(private data: DataService, private basketService: BasketService) { }

  ngOnInit(): void {
    this.currency = "GBP";
    this.data.getProducts().subscribe(res => this.products = res); 
    this.basket = this.basketService.get();
    this.basketSubscription = this.basket.subscribe((basket) => {
      this.itemCount = basket.items.map((x) => x.quantity).reduce((p, n) => p + n, 0);
    });
  }

  ngOnDestroy(): void {
    if (this.basketSubscription) {
      this.basketSubscription.unsubscribe();
    }
  }

  public addItem(id){
    this.basketService.addItem(id, 1); 
  }

  public emptyBasket(): void {
    this.basketService.empty();
  }

}

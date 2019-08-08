import { Component, OnInit } from '@angular/core';

import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";

import { DataService } from '../services/data.service'; 
import { BasketService } from '../services/basket.service'; 
import { Product } from "../models/product.model";
import { Basket } from "../models/basket.model"; 

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  public products: Product[]; 

  constructor(private data: DataService, private basketService: BasketService) { }

  ngOnInit() {
    console.log(this.data.getProducts());
    
    this.data.getProducts().subscribe(res => this.products = res);
  }

  public addItem(id){
    this.basketService.addItem(id, 1); 
  }

  public emptyBasket(): void {
    this.basketService.empty();
  }

}

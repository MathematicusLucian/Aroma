import { Component, OnInit, OnDestroy } from '@angular/core';

/** rxjs */
import { Observer, Observable, Subscription } from "rxjs";

/** models */
import { Product } from "../../models/product.model";
import { Basket } from "../../models/basket.model"; 

/** services */
import { DataService } from '../../services/data.service'; 
import { BasketService } from '../../services/basket.service'; 

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
    //default currency
    this.currency = "GBP";

    //subscribe to products, from products.json
    this.data.getProducts().subscribe(res => this.products = res); 

    //get a basket
    this.basket = this.basketService.get();

    //subscribe to the basket
    this.basketSubscription = this.basket.subscribe((basket) => {

      //count items
      this.itemCount = basket.items.map((x) => x.quantity).reduce((p, n) => p + n, 0);

    });
  }

  //destroy the basket subscription
  ngOnDestroy(): void {
    if (this.basketSubscription) {
      this.basketSubscription.unsubscribe();
    }
  }

  //add (or where -1, delete) item from the basket
  public addItem(id){
    this.basketService.addItem(id, 1); 
  }

  //empty the basket
  public emptyBasket(): void {
    this.basketService.empty();
  }

}

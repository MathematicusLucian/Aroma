import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Basket } from "../../models/basket.model";
import { BasketItem } from "../../models/basket-item.model"; 
import { Product } from "../../models/product.model";
import { DataService } from '../../services/data.service'; 
import { BasketService } from '../../services/basket.service';  

interface IBasketItem extends BasketItem {
  product: Product;
  subtotal: number;
}

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit, OnDestroy {

  public basket: Observable<Basket>;
  public basketItems: IBasketItem[];
  public itemCount: number;
  private products: Product[];
  private basketSubscription: Subscription;
  private exchangeRate: any;  
  public allCurrencies: any = [];
  public currency: any;  
  private errorMessage: any; 

  constructor(private data: DataService, private basketService: BasketService) {  
    data.getExchangeRates().subscribe(data => {

      let returned = data["rates"];  
      let z = JSON.stringify(returned).split(",").slice(1, -1); 
      let i = 0;

      z.forEach(element => { 
          let name = element.split(":")[0].slice(1, -1);

          this.allCurrencies.push({
            "id": i,
            "name": name,
            "rate": element.split(":")[1]
          }); 

          i++;
      }); 

    });   
  }
 
  ngOnInit(): void { 
    this.currency = "GBP";
    this.exchangeRate = 1;   
    this.basket = this.basketService.get(); 

    this.basketSubscription = this.basket.subscribe((basket) => {

      this.itemCount = basket.items.map((x) => x.quantity).reduce((p, n) => p + n, 0);

      this.data.getProducts().subscribe((products) => {
        
        this.products = products;

        this.basketItems = basket.items
          .map((item) => {
            const product = this.products.find((p) => p.id === item.productId);
            
            return {
              ...item,
              product,  
              price_exchanged: product.price * this.exchangeRate,
              subtotal: (product.price * item.quantity) * this.exchangeRate };
        });
      });
    });  
  }  

  ngOnDestroy(): void {
    if (this.basketSubscription) {
      this.basketSubscription.unsubscribe();
    }
  }

  public deleteItem(id){
    this.basketService.addItem(id, -1); 
  }

  public emptyBasket(): void {
    this.basketService.empty();
  } 

  setCurrency(e){ 
    this.currency = e.value;  

    for(let c of this.allCurrencies){
      if(c.name == e.value){
        this.exchangeRate = c.rate;
      }
    } 
  }

  private handleError(invoker, error) {
    console.error(`[BasketComponent.${invoker}] : ERROR : ${error}`);
    this.errorMessage  = "ERROR : ${error}`";
  } 

}

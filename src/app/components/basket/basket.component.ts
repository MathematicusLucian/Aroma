import { Component, OnInit, OnDestroy } from '@angular/core';

/** rxjs */
import { Observable, Subscription } from 'rxjs';

/** models */
import { Basket } from "../../models/basket.model";
import { BasketItem } from "../../models/basket-item.model"; 
import { Product } from "../../models/product.model";

/** services */
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
  public errorMessage: any; 

  constructor(private data: DataService, private basketService: BasketService) { 
    
    /** Get the ExchangeRates from the API */

    data.getExchangeRates().subscribe(data => {

      //"rates" field contains exchange rates
      let returned = data["rates"];  

      //change format
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

    },
    error => this.errorMessage = error
    );   
  }
 
  ngOnInit(): void { 

    //currency defaults
    this.currency = "GBP";
    this.exchangeRate = 1;  
    
    //get a basket
    this.basket = this.basketService.get(); 

    //set up a subscription
    this.basketSubscription = this.basket.subscribe((basket) => {

      //count items
      this.itemCount = basket.items.map((x) => x.quantity).reduce((p, n) => p + n, 0);

      //subscribe to all products
      this.data.getProducts().subscribe((products) => {
        
        this.products = products;

        this.basketItems = basket.items
          .map((item) => {
            //map item to product by productId to get the product details
            const product = this.products.find((p) => p.id === item.productId);
            
            //returns item plus respective product details
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
    //to delete an item we use the addItem function with a secondary parameter of negative one
    this.basketService.addItem(id, -1); 
  }

  public emptyBasket(): void {
    this.basketService.empty();
  } 

  setCurrency(e){ 
    //updates global currency value
    this.currency = e.value;  

    for(let c of this.allCurrencies){

      //get exchange rate for new currency chosen
      if(c.name == e.value){

        //set global exchange rate
        this.exchangeRate = c.rate;

      }
    
    } 

  } 

}

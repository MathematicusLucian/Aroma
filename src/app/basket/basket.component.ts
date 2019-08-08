import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service'; 

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {

  basket: any;
  total: any;
  exchangeRate: any;
  exchangeRates$: Observable<any[]>;
  errorMessage: any;

  constructor(private data: DataService) { 
  }

  ngOnInit() {
    console.log(this.data.getProducts());

    this.exchangeRate = 1;
    //this.exchangeRates$ = this.data.getExchangeRate("CAD");   
    this.getExchangeRate("CAD");

    this.updateBasketRender(); 
  }  

  private handleError(invoker, error) {
    console.error(`[BasketComponent.${invoker}] : ERROR : ${error}`);
    this.errorMessage  = "ERROR : ${error}`";
  }

  getExchangeRate(currency): void {
    this.data.getExchangeRate(currency)
      .subscribe(
        exchangeRate => {
          console.log(exchangeRate); 
          this.exchangeRate = exchangeRate;
        }, 
        error => this.handleError('getExchangeRate', error)
      )

    console.log(this.exchangeRate); 

  }

  updateBasketRender(){
    //this.basket = this.data.getProducts().filter(item => item.quantity > 0) as any; 
    //this.basket = this.basket.map(item => item.price = item.price * this.exchangeRate);
  }

  setCurrency(currency){
    this.getExchangeRate(currency);
    console.log(this.exchangeRate); 

    this.updateBasketRender();
  }

}

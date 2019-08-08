import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  basket = [
    { 
      name: "Peas", 
      price: "0.95", 
      type: "bag",
      quantity: 0 
    }, 
    { 
      name: "Eggs", 
      price: "2.10", 
      type: "dozen",
      quantity: 0 
    },
    { 
      name: "Milk",  
      price: "1.30", 
      type: "bottle",
      quantity: 0  
    },
    {
      name: "Beans", 
      price: "0.73", 
      type: "can",
      quantity: 0 
    }
  ]

  constructor() { } 

  addProduct(id){
    this.basket[id]["quantity"] += 1;
  }

  addDelete(id){
    this.basket[id]["quantity"] -= 1;
  }

  getBasketContents(){ 
    return this.basket;
  }
}

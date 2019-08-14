import { Injectable } from '@angular/core';

/** rxjs */
import { Observable, Observer, observable } from "rxjs";

/** models */
import { BasketItem } from "../models/basket-item.model";
import { Product } from "../models/product.model";
import { Basket } from "../models/basket.model"; 

/** services */
import { StorageService } from "./storage.service";
import { DataService } from "./data.service";

const basket_KEY = "basket";

@Injectable({
  providedIn: 'root'
})

export class BasketService {
  private storage: Storage;
  private subscriptionObservable: Observable<Basket>;
  private subscribers: Array<Observer<Basket>> = new Array<Observer<Basket>>();
  private products: Product[]; 

  //services dependency injection
  public constructor(private storageService: StorageService,
                     private data: DataService) {

    //get local storage
    this.storage = this.storageService.get();
    //subscribe to products
    this.data.getProducts().subscribe((products) => this.products = products);  

    //sub obs: basket observable
    this.subscriptionObservable = new Observable<Basket>((observer: Observer<Basket>) => {
      //push observer
      this.subscribers.push(observer);
      //load the saved basket from local storage
      observer.next(this.retrieve());

      return () => {
        this.subscribers = this.subscribers.filter((obs) => obs !== observer);
      };
      
    });
  }

  //get sub obs
  public get(): Observable<Basket> {
    return this.subscriptionObservable;
  }

  public addItem(product: Product, quantity: number): void {
    //load the saved basket from local storage
    const basket = this.retrieve(); 
    
    //get product details, such as name, for each item
    let item = basket.items.find((p) => p.productId === product.id);

    //add undefined items to basket
    if (item === undefined) {
      item = new BasketItem();
      item.productId = product.id;
      basket.items.push(item);
    } 

    item.quantity += quantity;

    //effectively filter out from basket any products the customer has not chosen
    basket.items = basket.items.filter((basketItem) => basketItem.quantity > 0);

    //set basket's grossTotal of items within
    this.calculateBasket(basket);

    //save the basket to local storage
    this.save(basket);

    //dispach the basket
    this.dispatch(basket);
  }

  //Find basket item's total value
  private calculateBasket(basket: Basket): void { 
    basket.itemsTotal = basket.items
    //multiply items' price by respective quantities
    .map((item) => item.quantity * this.products.find((p) => p.id === item.productId).price)
    //then use reduce
    .reduce((previous, current) => previous + current, 0); 

    //set basket's grossTotal variable
    basket.grossTotal = basket.itemsTotal;
  }

  //get basket details from local storage
  private retrieve(): Basket {

    //new basket
    const basket = new Basket();

    //get basket key
    const storedbasket = this.storage.getItem(basket_KEY);

    /** 
     * if basket with that key is in local storage
     * replace the new basket with that in storage 
    */
    if (storedbasket) {
      basket.updateFrom(JSON.parse(storedbasket));
    }

    return basket;
  }

  //save basket details (including contents) to local storage
  private save(basket: Basket): void {
    this.storage.setItem(basket_KEY, JSON.stringify(basket));
  } 

  //basket dispatch
  private dispatch(basket: Basket): void { 
    this.subscribers
      .forEach((sub) => {
        try {
          sub.next(basket);
        } catch (e) { 
        }
      });
  }

  //empties the basket, by replacing with a new Basket object
  public empty(): void {
    const newbasket = new Basket();
    
    this.save(newbasket);
    this.dispatch(newbasket);
  } 
}
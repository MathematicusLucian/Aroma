import { Injectable } from '@angular/core';

import { Observable, Observer } from "rxjs";

import { StorageService } from "./storage.service";
import { DataService } from "./data.service";

import { BasketItem } from "../models/basket-item.model";
import { Product } from "../models/product.model";
import { Basket } from "../models/basket.model"; 

const basket_KEY = "basket";

@Injectable({
  providedIn: 'root'
})

export class BasketService {
  private storage: Storage;
  private subscriptionObservable: Observable<Basket>;
  private subscribers: Array<Observer<Basket>> = new Array<Observer<Basket>>();
  private products: Product[]; 

  public constructor(private storageService: StorageService,
                     private data: DataService) {
    this.storage = this.storageService.get();
    this.data.getProducts().subscribe((products) => this.products = products); 

    this.subscriptionObservable = new Observable<Basket>((observer: Observer<Basket>) => {
      this.subscribers.push(observer);
      observer.next(this.retrieve());
      return () => {
        this.subscribers = this.subscribers.filter((obs) => obs !== observer);
      };
    });
  }

  public get(): Observable<Basket> {
    return this.subscriptionObservable;
  }

  public addItem(product: Product, quantity: number): void {
    const basket = this.retrieve(); 
    let item = basket.items.find((p) => p.productId === product.id);
    if (item === undefined) {
      item = new BasketItem();
      item.productId = product.id;
      basket.items.push(item);
    } 

    item.quantity += quantity;
    basket.items = basket.items.filter((basketItem) => basketItem.quantity > 0);

    this.calculateBasket(basket);
    this.save(basket);
    this.dispatch(basket);
  }

  private calculateBasket(basket: Basket): void {
    console.log( basket.items);

    console.log(this.products);

    basket.itemsTotal = basket.items
    .map((item) => item.quantity * this.products.find((p) => p.id === item.productId).price)
    .reduce((previous, current) => previous + current, 0); 
    basket.grossTotal = basket.itemsTotal;
  }

  private retrieve(): Basket {
    const basket = new Basket();
    const storedbasket = this.storage.getItem(basket_KEY);
    if (storedbasket) {
      basket.updateFrom(JSON.parse(storedbasket));
    }

    return basket;
  }

  private save(basket: Basket): void {
    this.storage.setItem(basket_KEY, JSON.stringify(basket));
  } 

  private dispatch(cart: Basket): void {
    this.subscribers
      .forEach((sub) => {
        try {
          sub.next(cart);
        } catch (e) { 
        }
      });
  }

  public empty(): void {
    const newbasket = new Basket();
    this.save(newbasket);
    this.dispatch(newbasket);
  } 
}
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { ProductsComponent } from './../products/products.component'; 
import { BasketComponent } from './basket.component';

import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { AppRoutingModule } from './../../app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule  } from './../../app-material.module';
import { FlexModule } from '@angular/flex-layout'; 

import { Observable, Observer, Subscription } from 'rxjs';

import * as sinon from "sinon";

import { Basket } from "../../models/basket.model";
import { BasketItem } from "../../models/basket-item.model"; 
import { Product } from "../../models/product.model";

import { DataService } from "./../../services/data.service";
import { BasketService } from "./../../services/basket.service"; 
import { LocalStorageService, StorageService } from "./../../services/storage.service"; 

const PRODUCT_1 = new Product();
PRODUCT_1.name = "Peas";
PRODUCT_1.id = "1";
PRODUCT_1.price = 0.95;

const PRODUCT_2 = new Product();
PRODUCT_2.name = "Eggs";
PRODUCT_2.id = "2";
PRODUCT_2.price = 2.10;

const PRODUCT_3 = new Product();
PRODUCT_3.name = "Milk";
PRODUCT_3.id = "3";
PRODUCT_3.price = 1.30;

// tslint:disable-next-line:max-classes-per-file
class MockProductDataService extends DataService {
  public getProducts(): Observable<Product[]> {
    return Observable.from([[PRODUCT_1, PRODUCT_2, PRODUCT_3]]);
  }
}

class MockBasketService {
  public unsubscribeCalled: boolean = false;
  public emptyCalled: boolean = false;
  private subscriptionObservable: Observable<Basket>;
  private subscriber: Observer<Basket>;
  private basket: Basket = new Basket();

  public constructor() {
    this.subscriptionObservable = new Observable<Basket>((observer: Observer<Basket>) => {
      this.subscriber = observer;
      observer.next(this.basket);
      return () => this.unsubscribeCalled = true;
    });
  }

  public addItem(product: Product, quantity: number): void {}

  public get(): Observable<Basket> {
    return this.subscriptionObservable;
  }

  public empty(): void {
    this.emptyCalled = true;
  }

  public dispatchBasket(basket: Basket): void {
    this.basket = basket;
    if (this.subscriber) {
      this.subscriber.next(basket);
    }
  }
}

describe('BasketComponent', () => {
  let component: BasketComponent;
  let fixture: ComponentFixture<BasketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ProductsComponent, 
        BasketComponent 
      ],
      imports: [ 
        HttpClientModule,
        AppRoutingModule, 
        BrowserAnimationsModule,
        AppMaterialModule,
        FlexModule
      ],
      providers: [
        { provide: DataService, useClass: MockProductDataService }, 
        { provide: StorageService, useClass: LocalStorageService },
        { provide: BasketService, useClass: MockBasketService }
      ]
    })
    .compileComponents();   

    fixture = TestBed.createComponent(BasketComponent);
    component = fixture.componentInstance; 

    fixture.detectChanges();
  }));

  it('should create', async(() => {  
    expect(component).toBeTruthy();
  }));
  
  it('should render "Basket Gross Total" in a h3 tag', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain('Basket Gross Total');
  });

  it('should render "Continue Shopping" in a button tag', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('button.mat-primary').textContent).toContain('Continue Shopping');
  });

  it('should render "Empty Basket" in a button tag', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('button.mat-warn').textContent).toContain('Empty Basket');
  });

  it("should display basket's gross total",
    async(inject([BasketService], (service: MockBasketService) => {
      const fixture = TestBed.createComponent(BasketComponent);
      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;

      expect(compiled.querySelector("#basket-total").textContent).toContain("0.00");

      const newBasket = new Basket();

      newBasket.grossTotal = 0.95;
      service.dispatchBasket(newBasket);
      fixture.detectChanges();

      expect(compiled.querySelector("#basket-total").textContent).toContain("0.95");
  })));

  it("should remove product from basket upon click on remove item button",
    async(inject([BasketService], (service: MockBasketService) => {
      const newBasket = new Basket();
      const newBasketItem = new BasketItem();

      newBasketItem.productId = PRODUCT_1.id;
      newBasketItem.quantity = 1;
      newBasket.grossTotal = 0.95;
      newBasket.items = [newBasketItem];

      service.dispatchBasket(newBasket);
      
      const fixture = TestBed.createComponent(BasketComponent);
      
      fixture.detectChanges();
      
      const addItemSpy = sinon.spy(service, "addItem");
      const component = fixture.debugElement.componentInstance;
      const compiled = fixture.debugElement.nativeElement;
      const productElements = compiled.querySelectorAll("#basket-items"); 

      productElements[0].querySelector("button.mat-warn").click();
      
      sinon.assert.calledOnce(addItemSpy);
      sinon.assert.calledWithExactly(addItemSpy, PRODUCT_1, -1);
  }))); 

  it("should empty basket upon click on the empty basket button",
    async(inject([BasketService], (service: MockBasketService) => {
      const basket = new Basket();
      const newBasketItem = new BasketItem();

      newBasketItem.productId = "1";
      newBasketItem.quantity = 1; 
      basket.grossTotal = 0.95;
      basket.items = [newBasketItem]; 

      service.dispatchBasket(basket);

      const fixture = TestBed.createComponent(BasketComponent);
      fixture.detectChanges();

      fixture.debugElement.nativeElement.querySelector("#empty-basket").click();

      expect(service.emptyCalled).toBeTruthy();
    })));

});

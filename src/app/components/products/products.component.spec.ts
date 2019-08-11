import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { ProductsComponent } from './products.component'; 
import { BasketComponent } from './../basket/basket.component'; 

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
PRODUCT_2.id = "3";
PRODUCT_2.price = 2.10;

const PRODUCT_3 = new Product();
PRODUCT_2.name = "Milk";
PRODUCT_2.id = "4";
PRODUCT_2.price = 1.30;

// tslint:disable-next-line:max-classes-per-file
class MockProductDataService extends DataService {
  public all(): Observable<Product[]> {
    return Observable.from([[PRODUCT_1, PRODUCT_2, PRODUCT_3]]);
  }
}

// tslint:disable-next-line:max-classes-per-file
class MockBasketService {
  public unsubscriveCalled: boolean = false;
  public emptyCalled: boolean = false;

  private subscriptionObservable: Observable<Basket>;
  private subscriber: Observer<Basket>;
  private basket: Basket = new Basket();

  public constructor() {
    this.subscriptionObservable = new Observable<Basket>((observer: Observer<Basket>) => {
      this.subscriber = observer;
      observer.next(this.basket);
      return () => this.unsubscriveCalled = true;
    });
  }

  public addItem(product: Product, quantity: number): void {}

  public get(): Observable<Basket> {
    return this.subscriptionObservable;
  }

  public empty(): void {
    this.emptyCalled = true;
  }

  public dispatchbasket(basket: Basket): void {
    this.basket = basket;
    if (this.subscriber) {
      this.subscriber.next(basket);
    }
  }
}

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;

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
        { provide: BasketService, useClass: BasketService },
        { provide: DataService, useClass: MockProductDataService },
        { provide: StorageService, useClass: LocalStorageService }
      ]  
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;

    const dataService = fixture.debugElement.injector.get(DataService);
    const basketService = fixture.debugElement.injector.get(BasketService);
    const storageService = fixture.debugElement.injector.get(StorageService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render "Add a product" in a h3 tag', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain('Add a product to the basket');
  });

  it('should render "View Basket" in a button tag', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('button.mat-primary').textContent).toContain('View Basket');
  });

  it('should render "Empty Basket" in a button tag', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('button.mat-warn').textContent).toContain('Empty Basket');
  });

  it("should display all products", async(() => { 
    fixture.detectChanges(); 
    
    const compiled = fixture.debugElement.nativeElement;

    const productElements = compiled.querySelectorAll("#products");
    expect(productElements.length).toEqual(2);

    expect(productElements[0].querySelector(".item-name").textContent).toEqual(PRODUCT_1.name);
    expect(productElements[0].querySelector(".item-price").textContent).toContain(PRODUCT_1.price); 

    expect(productElements[1].querySelector(".item-name").textContent).toEqual(PRODUCT_2.name);
    expect(productElements[1].querySelector(".item-price").textContent).toContain(PRODUCT_2.price); 

    expect(productElements[0].querySelector(".item-name").textContent).toEqual(PRODUCT_3.name);
    expect(productElements[0].querySelector(".item-price").textContent).toContain(PRODUCT_3.price); 

  }));

  it("should add product to basket upon click on add item button",
     async(inject([BasketService], (service: MockBasketService) => {
    const fixture = TestBed.createComponent(ProductsComponent);
    fixture.detectChanges();

    const addItemSpy = sinon.spy(service, "addItem");

    const component = fixture.debugElement.componentInstance;
    const compiled = fixture.debugElement.nativeElement;
    const productElements = compiled.querySelectorAll("#products");

    productElements[0].querySelector(".add-item").click();
    sinon.assert.calledOnce(addItemSpy);
    sinon.assert.calledWithExactly(addItemSpy, PRODUCT_1, 1);
  })));
});

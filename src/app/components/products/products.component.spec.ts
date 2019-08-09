import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsComponent } from './products.component'; 
import { BasketComponent } from './../basket/basket.component';

import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { AppRoutingModule } from './../../app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule  } from './../../app-material.module';
import { FlexModule } from '@angular/flex-layout'; 

import { DataService } from "./../../services/data.service";
import { BasketService } from "./../../services/basket.service"; 
import { LocalStorageService, StorageService } from "./../../services/storage.service"; 

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
        DataService, 
        LocalStorageService,
        { provide: StorageService, useClass: LocalStorageService },
        {
          deps: [StorageService, DataService],
          provide: BasketService,
          useClass: BasketService
        }
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
});

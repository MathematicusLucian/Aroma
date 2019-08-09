import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsComponent } from './../products/products.component'; 
import { BasketComponent } from './basket.component';

import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { AppRoutingModule } from './../../app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule  } from './../../app-material.module';
import { FlexModule } from '@angular/flex-layout'; 

import { DataService } from "./../../services/data.service";
import { BasketService } from "./../../services/basket.service"; 
import { LocalStorageService, StorageService } from "./../../services/storage.service"; 

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
    fixture = TestBed.createComponent(BasketComponent);
    component = fixture.componentInstance;
    const dataService = fixture.debugElement.injector.get(DataService);
    const basketService = fixture.debugElement.injector.get(BasketService);
    const storageService = fixture.debugElement.injector.get(StorageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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
});

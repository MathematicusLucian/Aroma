import { TestBed } from '@angular/core/testing';

import { BasketService } from './basket.service';

import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { DataService } from "./../services/data.service";
import { LocalStorageService, StorageService } from "./../services/storage.service";

describe('BasketService', () =>  {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ 
      HttpClientModule
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
  }));

  it('should be created', () => {
    const basketService: BasketService = TestBed.get(BasketService);
    expect(basketService).toBeTruthy();
  });

  function setup() {
    const basketService: BasketService = TestBed.get(BasketService); 
    return { basketService };
  }

  it('should be value 0 on basket.items', (done: DoneFn) => {
    const { basketService } = setup(); 
    basketService.get().subscribe((basket) => {  
      expect(basket.items).toEqual([]); 
      done();
    });  
  }); 

  it('should be value 0 on basket.grossTotal', (done: DoneFn) => {
    const { basketService } = setup(); 
    basketService.get().subscribe((basket) => {  
      expect(basket.grossTotal).toEqual(0); 
      done();
    });  
  }); 

  it('should be value 0 on basket.itemsTotal', (done: DoneFn) => {
    const { basketService } = setup(); 
    basketService.get().subscribe((basket) => {  
      expect(basket.itemsTotal).toEqual(0);  
      done();
    });  
  });  

});

import { inject, TestBed } from "@angular/core/testing";

import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
         //XHRBackend, MockBackend, 
         //Response, ResponseOptions 

import "rxjs/add/observable/from";
import { Observable } from "rxjs/Observable";

import * as sinon from "sinon";

import { BasketService } from './basket.service';
import { DataService } from "./../services/data.service"; 
import { LocalStorageService, StorageService } from "./../services/storage.service";
 
import { Product } from "./../models/product.model";
import { Basket } from "./../models/basket.model";

describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        DataService,
       { 
         //provide: XHRBackend, useClass: MockBackend 
       }
     ]
    });
  });

  it("should be injectable", inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));

  it('should be created', () => {
    const service: DataService = TestBed.get(DataService);
    expect(service).toBeTruthy();
  });

  function setup() {
    const dataService = TestBed.get(DataService); 
    return { dataService };
  }

  /*
  describe("getProducts()", () => {
    it("should call the correct http endpoint",
      inject([DataService, XHRBackend],
      (service: DataService, mockBackend: MockBackend) => {

      mockBackend.connections.subscribe((connection) => {
        expect(connection.request.url).toEqual("./assets/products.json");
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(createProducts(2))
        })));
      });

      service.getProducts()
        .subscribe((products) => {
          expect(products.length).toBe(2);
          expect(products[0].id).toBe("0");
          expect(products[1].id).toBe("1");
          expect(products[2].id).toBe("2");
        });
    }));
  });
  */

  it('should call the Products data', (done: DoneFn) => {
    const { dataService } = setup();

    const mockProductsData = [ { "id": 1, "name": "Peas", "price": 0.95, "grouping": "bag", "img": "peas.jpg" }, { "id": 2, "name": "Eggs", "price": 2.10, "grouping": "dozen", "img": "eggs.jpg" }, { "id": 3, "name": "Milk", "price": 1.30, "grouping": "bottle", "img": "milk.jpg" }, { "id": 4, "name": "Beans", "price": 0.73, "grouping": "can", "img": "beans.jpg" } ];
    
    dataService.getProducts().subscribe(data => { 
      expect(data).toEqual(mockProductsData);
      done();
    }); 
  }); 

  it('should receive Products data > 0', (done: DoneFn) => {
    const { dataService } = setup();

    let noOfProducts = 0;

    dataService.getProducts().subscribe(data => {  
      noOfProducts = data.length;
      expect(noOfProducts).toBeGreaterThan(0); 
      done();
    }); 
  }); 

  /* Data changes each day */
  it('should call the Exchange Rates data', (done: DoneFn) => {
    const { dataService } = setup();
    const mockExchangeRatesData = { rates: Object({ CAD: 1.6147207295, HKD: 9.5287412474, ISK: 149.0528144168, PHP: 63.3414753298, DKK: 8.1019377951, HUF: 352.9066927211, CZK: 27.9965260815, GBP: 1, RON: 5.1348857407, SEK: 11.6734516637, IDR: 17264.300059708, INR: 85.952342181, BRL: 4.8073603648, RUB: 79.4015089833, HRK: 8.0132443142, JPY: 128.79552733, THB: 37.3587363622, CHF: 1.1858003582, EUR: 1.0855995223, MYR: 5.0852738425, BGN: 2.1232155458, TRY: 6.6619985887, CNY: 8.5624491125, NOK: 10.8755360148, NZD: 1.881886772, ZAR: 18.4026488628, USD: 1.2151115454, MXN: 23.8017695272, SGD: 1.6808337404, AUD: 1.7893936927, ILS: 4.2281930196, KRW: 1468.9898496445, PLN: 4.6927210552 }), base: 'GBP', date: '2019-08-08' };
    dataService.getExchangeRates().subscribe(data => { 
      expect(data).toEqual(mockExchangeRatesData);
      done();
    }); 
  });  
});

function createProducts(count: number): Product[] {
  const products = new Array<Product>();

  for (let i = 0; i < count; i += 1) {
    const product = new Product();
    product.id = i.toString();
    product.name = `name ${i}`; 
    product.price = i; 
    products.push(product);
  }

  return products; 
} 
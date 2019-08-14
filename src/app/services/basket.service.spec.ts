import { async, inject, TestBed } from "@angular/core/testing";

import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http'; 

import "rxjs/add/observable/from";
import { Observable } from "rxjs/Observable";

import * as sinon from "sinon";

import { BasketService } from './basket.service';
import { DataService } from "./../services/data.service"; 
import { LocalStorageService, StorageService } from "./../services/storage.service";
 
import { Product } from "./../models/product.model";
import { Basket } from "./../models/basket.model";

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

/**    desc: "A smooth, medium-bodied blend. Made with 100% prized Arabica Beans."
    grouping: "bag"
    id: 2
    img: "00043000050019.1200w.jpg"
    name: "Signature Blend 12CT"
    price: 9.29

    desc: "With one touch of a button, find yourself transported to a toasty lodge in the snow-covered Alps. Gently roasted Swiss Hazelnut from Gevalia offers a beautiful blend of Arabica beans and soft hazelnut flavor, delivering the satisfying smoothness you desire."
grouping: "bag"
id: 2
img: "00043000019429.1200w.jpg"
name: "GEVALIA Swiss Hazelnut"
price: 14.99

desc: "The signature Peet’s roast gives our Decaf House more body and complexity than almost any other decaf blend. Packaging may vary."
grouping: "bag"
id: 3
img: "HouseBlendDecaf_16ct_KCup_w_Pods_Hi-Res_Final_720x540.jpg"
name: "Decaf House Blend K-Cup® Packs"
price: 13.99

desc: "Our most exquisite coffee blend, created by Roastmaster Emeritus Jim Reynolds from rare lots. Exceptionally complex and full-bodied, revealing hints of chocolate and spice."
grouping: "bag"
id: 4
img: "pct_hd_reserve_8oz_jr_1440x1080.jpg"
name: "JR Reserve Blend"
price: 24.95 */

class MockProductDataService extends DataService {
  public getProducts(): Observable<Product[]> {
    return Observable.from([[PRODUCT_1, PRODUCT_2, PRODUCT_3]]);
  }
}

describe("BasketService", () => {

  let sandbox: sinon.SinonSandbox;

  beforeEach(async(() => {
    sandbox = sinon.createSandbox();

    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
       { provide: DataService, useClass: MockProductDataService }, 
       { provide: StorageService, useClass: LocalStorageService },
        BasketService
     ]
    });
  }));

  afterEach(() => {
    sandbox.restore();
  });

  it("should be injectable", inject([BasketService], (service: BasketService) => {
    expect(service).toBeTruthy();
  }));

  describe("get()", () => {
  
    it("should return an Observable<Basket>",
       inject([BasketService], (service: BasketService) => {

          service.empty();

          const basketService = service.get();

          expect(basketService).toEqual(jasmine.any(Observable));
    })); 

    it('should be value 0 on basket.items',
      inject([BasketService], (service: BasketService) => {

        service.empty();

        const basketService = service.get(); 

        basketService.subscribe((basket) => {  
          expect(basket.items).toEqual([]); //1
      });  
    })); 

    it('should be value 0 on basket.grossTotal',
      inject([BasketService], (service: BasketService) => {

        service.empty();

        const basketService = service.get(); 

        basketService.subscribe((basket) => {  
          expect(basket.grossTotal).toEqual(0); //0.95 
      });  
    })); 

    it('should be value 0 on basket.itemsTotal',
      inject([BasketService], (service: BasketService) => {

        service.empty();

        const basketService = service.get(); 

        basketService.subscribe((basket) => {  
          expect(basket.itemsTotal).toEqual(0); //0.95
        });  
    })); 

    it("should return a Basket model instance when the Observable is subscribed to",
      inject([BasketService], (service: BasketService) => {

        service.empty();

        const basketService = service.get();

        basketService.subscribe((basket) => {
          expect(basket).toEqual(jasmine.any(Basket));

          expect(basket.items.length).toEqual(0); //1
          expect(basket.itemsTotal).toEqual(0); //0.95
          expect(basket.grossTotal).toEqual(0); //0.95
        });
    }));

    it("should return a populated Basket model instance when the Observable is subscribed to",
      inject([BasketService], (service: BasketService) => {

        const TestBasket = new Basket(); 

        TestBasket.itemsTotal = 2;
        TestBasket.grossTotal = 3;

        sandbox.stub(localStorage, "getItem")
          .returns(JSON.stringify(TestBasket));

        const basketService = service.get();

        basketService.subscribe((basket) => {
          expect(basket).toEqual(jasmine.any(TestBasket));
          expect(basket.itemsTotal).toEqual(TestBasket.itemsTotal);
          expect(basket.grossTotal).toEqual(TestBasket.grossTotal);
      });

    }));
  
  }); 

  describe("empty()", () => { 

    it("should create empty basket and persist",
      inject([BasketService], (service: BasketService) => {

        const stub = sandbox.stub(localStorage, "setItem");
        service.empty(); 

        (done: DoneFn) => {
          sinon.assert.calledOnce(stub);
  
          done();
        }
    })); 

  });

  describe("addItem()", () => {
    beforeEach(() => {
      let persistedbasket: string;

      const setItemStub = sandbox.stub(localStorage, "setItem")
        .callsFake((key, val) => persistedbasket = val);

      sandbox.stub(localStorage, "getItem")
        .callsFake((key) => persistedbasket);
    });  

    it("should add the item to the basket and persist",
      inject([BasketService], (service: BasketService) => {   
        service.addItem(PRODUCT_1, 1);

        service.get()
          .subscribe((basket) => {
            expect(basket.items.length).toEqual(1);
            expect(basket.items[0].productId).toEqual(PRODUCT_1.id);
          });
    }));

    it("should dispatch basket",
       inject([BasketService], (service: BasketService) => {
         let dispatchCount = 0;

         service.get()
          .subscribe((basket) => {
              dispatchCount += 1;

              if (dispatchCount === 2) {
                expect(basket.grossTotal).toEqual(PRODUCT_1.price);
              }
          });

         service.addItem(PRODUCT_1, 1);

         expect(dispatchCount).toEqual(2);
    }));

    it("should set the correct quantity on products already added to the basket",
      inject([BasketService], (service: BasketService) => {
        service.addItem(PRODUCT_1, 1);
        service.addItem(PRODUCT_1, 3);

        service.get()
          .subscribe((basket) => { 
            expect(basket.items[0].quantity).toEqual(4);
          });
    }));

 }); 

  describe("totals calculation", () => {

    beforeEach(async(() => {
      let persistedbasket: string;
      
      const setItemStub = sandbox.stub(localStorage, "setItem")
        .callsFake((key, val) => persistedbasket = val);

      sandbox.stub(localStorage, "getItem")
        .callsFake((key) => persistedbasket);
    }));

    it("should calculate the shopping basket totals correctly",
      inject([BasketService], (service: BasketService) => {
        service.addItem(PRODUCT_1, 2);
        service.addItem(PRODUCT_2, 1);
        service.addItem(PRODUCT_3, 1); 

        service.get()
          .subscribe((basket) => {
            expect(basket.items.length).toEqual(3); 
            expect(basket.itemsTotal).toEqual((PRODUCT_1.price * 2) + PRODUCT_2.price + PRODUCT_3.price);
          });
    }));

  });

});
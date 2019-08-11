import { browser, by, element, promise } from "protractor";
import { Product } from "./models/product.model";

export class ProductsPageObject {
  public navigateTo(): promise.Promise<any> {
    return browser.get("/");
  }

  public async getProducts(): promise.Promise<Product[]> {
    const defer = promise.defer<Product[]>();
    try {
      const results = await element.all(by.css(".product-card"))
        .map<Product>(async (el) => {
            const product = new Product();
            product.name = await el.element(by.css(".item-name")).getText();
            const priceText = await el.element(by.css(".item-price")).getText();
            product.price = parseFloat(priceText.replace(/[a-z,£: ]/gi, ""));
            return product;
        });
      defer.fulfill(results);
    } catch (er) {
      defer.reject(er);
    }
    return defer.promise;
  }
}
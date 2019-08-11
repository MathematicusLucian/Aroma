import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

import { ProductsPageObject } from "./products.page-object";

describe('workspace-project App', () => {
  let page: ProductsPageObject;

  beforeEach(() => {
    page = new ProductsPageObject();
  });

  /* it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('');
  }); */

  it("should display products", async () => {
    await page.navigateTo();
    const products = await page.getProducts();
    expect(products.length).toEqual(4);
    expect(products[0].name).toEqual("Peas");
    expect(products[0].price).toEqual(0.95);
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});

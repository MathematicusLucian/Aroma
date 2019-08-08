import { BasketItem } from "./basket-item.model";

export class Basket {
  public items: BasketItem[] = new Array<BasketItem>();
  public grossTotal: number = 0;
  public itemsTotal: number = 0;

  public updateFrom(src: Basket) {
    this.items = src.items;
    this.grossTotal = src.grossTotal;
    this.itemsTotal = src.itemsTotal;
  }
}
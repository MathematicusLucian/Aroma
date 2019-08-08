import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service'; 

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  basket: any;

  constructor(private data: DataService) { }

  ngOnInit() {
    this.basket = this.data.getBasketContents();
    console.log(this.basket);
  }

}

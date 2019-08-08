import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service'; 

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {

  basket: any;
  total: any;

  constructor(private data: DataService) { }

  ngOnInit() {
    this.basket = this.data.getBasketContents(); 
    this.getTotal();
  }

  getTotal(){
    this.total = this.data.getTotal();
  }

}

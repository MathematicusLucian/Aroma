import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BasketComponent } from './components/basket/basket.component';
import { ProductsComponent } from './components/products/products.component';

const routes: Routes = [
  { path: '', component: ProductsComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'basket', component: BasketComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

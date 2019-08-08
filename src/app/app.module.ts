import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule  } from './app-material.module';
import { FlexModule } from '@angular/flex-layout';
import { BasketComponent } from './basket/basket.component';
import { ProductsComponent } from './products/products.component';

@NgModule({
  declarations: [
    AppComponent,
    BasketComponent,
    ProductsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    BrowserAnimationsModule,
    AppMaterialModule,
    FlexModule, 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

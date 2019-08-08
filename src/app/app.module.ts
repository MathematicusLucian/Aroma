import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule  } from './app-material.module';
import { FlexModule } from '@angular/flex-layout';
import { BasketComponent } from './basket/basket.component';
import { ProductsComponent } from './products/products.component';

import { DataService } from "./services/data.service";
import { BasketService } from "./services/basket.service"; 
import { LocalStorageService, StorageService } from "./services/storage.service";

@NgModule({
  declarations: [
    AppComponent,
    BasketComponent,
    ProductsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule, 
    BrowserAnimationsModule,
    AppMaterialModule,
    FlexModule, 
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

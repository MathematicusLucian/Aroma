import { NgModule } from '@angular/core';

import { MatToolbarModule, 
         MatCardModule, 
         MatButtonModule,
         MatSelectModule } from '@angular/material';

const materialModules = [
  MatToolbarModule,
  MatCardModule,
  MatButtonModule,
  MatSelectModule
];

@NgModule({
  imports: materialModules,
  exports: materialModules
})
export class AppMaterialModule { }
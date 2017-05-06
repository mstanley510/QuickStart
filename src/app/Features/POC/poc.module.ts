
import { NgModule }             from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { SharedModule } from '../../Shared/shared.module';

import { POCRoutingModule } from './poc-routing.module';

import { POCMikeMainComponent } from './Mike/poc-mike-main.component';
import { POCTonyMainComponent } from './Tony/poc-tony-main.component';
import { GetProductsComponent } from './Mike/get-products.component';
import { GetFuturesComponent } from './Mike/get-futures.component';
import { GetExpirationsComponent } from './Mike/get-expirations.component';
import { GetStrikesComponent } from './Mike/get-strikes.component';
import { CalculatorComponent } from './Mike/calculator.component';
import { SheetComponent } from './Mike/sheet.component';
import { Demo1Component } from './Mike/demo1.component';
import { ObservableTestComponent } from './Mike/observable-test.component';

@NgModule({
  imports: 
  [ 
    CommonModule,
    FormsModule,
    SharedModule,
    POCRoutingModule
  ],
  declarations: [ 
      POCMikeMainComponent,
      POCTonyMainComponent,
      GetProductsComponent,
      GetFuturesComponent,
      GetExpirationsComponent,
      GetStrikesComponent,
      CalculatorComponent,
      SheetComponent,
      Demo1Component,
      ObservableTestComponent
      ],
})

export class POCModule {}

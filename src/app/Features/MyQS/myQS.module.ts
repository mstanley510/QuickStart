
import { NgModule }             from '@angular/core';
import { CommonModule }   from '@angular/common';

import { MyQSRoutingModule } from './myQS-routing.module';

import { MyQSComponent } from './myQS.component';
import { CalculatorComponent } from '../../Components/Shared/Tools/Calculator/calculator.component';
import { PricingSheetComponent } from '../../Components/Shared/Sheets/PricingSheet/pricingsheet.component';
import { StraddleSheetComponent } from '../../Components/Shared/Sheets/StraddleSheet/straddlesheet.component';

import { ViewListComponent } from './ViewList/view-list.component';


@NgModule({
  imports: [ 
      MyQSRoutingModule,
      CommonModule
      ],
  declarations: [ 
      MyQSComponent,
      ViewListComponent,
      CalculatorComponent,
      PricingSheetComponent,
      StraddleSheetComponent
      ],
})

export class MyQSModule {}

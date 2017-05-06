import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MyQSComponent } from './myQS.component';
import { CalculatorComponent } from '../../Components/Shared/Tools/Calculator/calculator.component';
import { PricingSheetComponent } from '../../Components/Shared/Sheets/PricingSheet/pricingsheet.component';
import { StraddleSheetComponent } from '../../Components/Shared/Sheets/StraddleSheet/straddlesheet.component';


const pocRoutes: Routes = [
    { path: 'myQS', component: MyQSComponent },
    { path: 'myQS/calculator/:vid', component: CalculatorComponent },
    { path: 'myQS/pricingsheet/:vid', component: PricingSheetComponent },
    { path: 'myQS/straddlesheet/:vid', component: StraddleSheetComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(pocRoutes) ],
  exports: [ RouterModule ]
})

export class MyQSRoutingModule { }

import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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

const pocRoutes: Routes = [
    { path: 'poc/mike', component: POCMikeMainComponent },
    { path: 'poc/mike/get-products', component: GetProductsComponent },
    { path: 'poc/mike/get-futures', component: GetFuturesComponent },
    { path: 'poc/mike/get-expirations', component: GetExpirationsComponent },
    { path: 'poc/mike/get-strikes', component: GetStrikesComponent },
    { path: 'poc/mike/calculator', component: CalculatorComponent },
    { path: 'poc/mike/sheet', component: SheetComponent },
    { path: 'poc/mike/demo1', component: Demo1Component },
    { path: 'poc/mike/observable-test', component: ObservableTestComponent },
    { path: 'poc/tony', component: POCTonyMainComponent }    
];

@NgModule({
  imports: [ RouterModule.forChild(pocRoutes) ],
  exports: [ RouterModule ]
})

export class POCRoutingModule { }

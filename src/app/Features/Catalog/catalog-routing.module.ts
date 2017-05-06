import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CatalogComponent } from './catalog.component';
import { CatalogWelcomeComponent } from './catalog-welcome.component';
import { CatalogCalculatorComponent } from './catalog-calculator.component';

const catalogRoutes: Routes = [
  {
    path: 'catalog',
    component: CatalogComponent,
    children: [
      { path: '', component: CatalogWelcomeComponent },
      { path: 'welcome', component: CatalogWelcomeComponent },
      { path: 'calculator', component: CatalogCalculatorComponent }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(catalogRoutes) ],
  exports: [ RouterModule ]
})

export class CatalogRoutingModule { }

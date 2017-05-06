import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home.component';


const pocRoutes: Routes = [
    { path: 'home', component: HomeComponent },
];

@NgModule({
  imports: [ RouterModule.forChild(pocRoutes) ],
  exports: [ RouterModule ]
})

export class HomeRoutingModule { }

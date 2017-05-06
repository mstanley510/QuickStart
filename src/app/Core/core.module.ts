import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageNotFoundComponent } from './PageNotFound/page-not-found.component';

@NgModule({
  imports: [ 
      CommonModule 
    ],
  declarations: 
  [ 
    PageNotFoundComponent
  ]
})

export class CoreModule { }

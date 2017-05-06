import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';

import { CatalogRoutingModule } from './catalog-routing.module';

import { CatalogComponent } from './catalog.component';
import { CatalogWelcomeComponent } from './catalog-welcome.component';
import { CatalogCalculatorComponent } from './catalog-calculator.component';
import { CatalogNavComponent } from './catalog-nav.component';

@NgModule({
    imports: [
        CommonModule,
        CatalogRoutingModule
    ],
    declarations: [
        CatalogComponent,
        CatalogNavComponent,
        CatalogWelcomeComponent,
        CatalogCalculatorComponent
    ]
})

export class CatalogModule {}

import { NgModule }      from '@angular/core';
import { RouterModule }   from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent }  from './app.component';
import { MainNavComponent } from './Core/MainNav/mainNav.component'; //<- Need to move to CoreModule but lost functionality when I did - due to NgbModule????

import { CoreModule } from './Core/core.module';
import { SharedModule } from './Shared/shared.module';
import { HomeModule } from './Features/Home/home.module';
import { MyQSModule } from './Features/MyQS/myQS.module';
import { CatalogModule } from './Features/Catalog/catalog.module';
import { AdminModule } from './Features/Admin/admin.module';
import { POCModule } from './Features/POC/poc.module';


@NgModule({
  imports:      
  [ 
    BrowserModule, 
    CoreModule,
    HttpModule,
    JsonpModule,
    SharedModule,
    HomeModule,
    MyQSModule,
    CatalogModule,
    AdminModule,
    POCModule,
    AppRoutingModule,
    NgbModule.forRoot()
  ],
  declarations: [ AppComponent, MainNavComponent ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }

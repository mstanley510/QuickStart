import { Component } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { Logger } from './Services/logger.service';
import { Config } from './Services/config.service';
import { ViewListService } from './Services/ViewList/view-list.service';
import { DataService } from './Services/data-service.service';
import { DataStore } from './Services/data-store.service';

import { FuturePriceServer } from './Services/future-price-server';
import { StaticFuturePriceServer } from './Services/static-future-price-server.service';
import { RandomFuturePriceServer } from './Services/random-future-price-server.service';
import { PollingFuturePriceServer } from './Services/polling-future-price-server.service';

import { VolServer } from './Services/vol-server';
import { StaticVolServer } from './Services/static-vol-server.service';
import { RandomVolServer } from './Services/random-vol-server.service';

@Component({
  selector: 'my-app',
  template: `

    <qs-main-nav></qs-main-nav>
    <div style="margin:0.5em;margin-top:80px;">
      <router-outlet></router-outlet>
    </div>
    
  `,
  providers: 
  [ 
    Logger,
    Config,
    ViewListService, 
    DataService, 
    DataStore, 
    { provide: FuturePriceServer, useClass: RandomFuturePriceServer},
    { provide: VolServer, useClass: RandomVolServer}
    
  ]
})

export class AppComponent  { name = 'Angular'; }

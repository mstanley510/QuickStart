import { Injectable }   from '@angular/core';
import { Http, Response } from '@angular/http';


import { Observable } from 'rxjs/Observable';
import { ConnectableObservable } from 'rxjs/Observable/ConnectableObservable';
import 'rxjs/add/operator/publish';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/map';

import {Logger} from './logger.service';
import {Config} from './config.service';

import {FuturePriceServer} from './future-price-server';
import {StaticFuturePriceServer} from './static-future-price-server.service';
import {Product} from "../Entities/Product";
import {FuturePrice, IFuturePrice} from "../Entities/FuturePrice";

@Injectable()
export class RandomFuturePriceServer extends StaticFuturePriceServer {

    private observable:ConnectableObservable<FuturePrice[]> = null;

    constructor(http: Http, config: Config, logger: Logger)
    {
        super(http, config, logger);
    }

    getFuturePrices(product: Product) : Observable<FuturePrice[]>{

        if (this.observable == null)
        {
            this.observable = Observable.combineLatest(
                super.getFuturePrices(product),
                Observable.interval(product.futureRefreshInterval).startWith(0),
                function(s1, s2){
                    s1.forEach((x:FuturePrice) => {
                        x.Open = x.Open * (1 + 0.005 * (Math.random() - 0.5));
                        x.High = x.High * (1 + 0.005 * (Math.random() - 0.5));
                        x.Low = x.Low * (1 + 0.005 * (Math.random() - 0.5));
                        x.Last = x.Last * (1 + 0.005 * (Math.random() - 0.5));
                    });
                    return s1;
                }
            ).publish();

            this.observable.connect();
        }

        return this.observable;
    }
}

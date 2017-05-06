import { Injectable }   from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/map';

import {Logger} from './logger.service';
import {Config} from './config.service';

import {FuturePriceServer} from './future-price-server';
import {StaticFuturePriceServer} from './static-future-price-server.service';
import {FuturePrice}        from "../Entities/FuturePrice";
import {IFuturePrice}        from "../Entities/FuturePrice";

@Injectable()
export class RandomFuturePriceServer extends StaticFuturePriceServer {

    constructor(http: Http, config: Config, logger: Logger)
    {
        super(http, config, logger);
    }

    getFuturePrices(productId: number, interval: number) : Observable<FuturePrice[]>{

        let observable1 = super.getFuturePrices(productId, interval);
        let observable2 = Observable.interval(interval);
        let observable3 = Observable.combineLatest(
            observable1,
            observable2,
            function(s1, s2){
                s1.forEach((x:FuturePrice) => {
                    x.Open = x.Open * (1 + 0.005 * (Math.random() - 0.5));
                    x.High = x.High * (1 + 0.005 * (Math.random() - 0.5));
                    x.Low = x.Low * (1 + 0.005 * (Math.random() - 0.5));
                    x.Last = x.Last * (1 + 0.005 * (Math.random() - 0.5));
                });
                return s1;
            }
        );
        return observable3;
    }
}

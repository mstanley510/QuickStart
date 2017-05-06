import { Injectable }   from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/map';

import {Logger} from './logger.service';
import {Config} from './config.service';

import {FuturePriceServer} from './future-price-server';
import {FuturePrice}        from "../Entities/FuturePrice";
import {IFuturePrice}        from "../Entities/FuturePrice";

@Injectable()
export class PollingFuturePriceServer extends FuturePriceServer {

    constructor(private http: Http, config: Config, logger: Logger)
    {
        super(config, logger);
    }

    getFuturePrices(productId: number, interval: number) : Observable<FuturePrice[]>{

        let url = this.config.dataUrl + 'GetFuturesPrice/' + productId;
        
        let observable1 = this.http.get(url);
        let observable2 = Observable.interval(interval).flatMap(x => this.http.get(url));
        let observable3 = Observable.merge(observable1, observable2).map(res => {
            let data = res.json() || [];
            let prices = new Array<FuturePrice>();
            data.forEach((ifp: IFuturePrice) => { prices.push(FuturePrice.fromIFP(ifp)); })
            this.logger.log('Got future prices for ' + productId + ' from server ....');
            return prices;
        });

        return observable3;
    }
}
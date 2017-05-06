import { Injectable }   from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import {Logger} from './logger.service';
import {Config} from './config.service';

import {FuturePriceServer} from './future-price-server';
import {FuturePrice}        from "../Entities/FuturePrice";
import {IFuturePrice}        from "../Entities/FuturePrice";

@Injectable()
export class StaticFuturePriceServer extends FuturePriceServer {

    constructor(private http: Http, config: Config, logger: Logger)
    {
        super(config, logger);
    }

    getFuturePrices(productId: number, interval: number): Observable<FuturePrice[]>
    {
        this.logger.log('Getting product ' + productId + ' future prices from server...');
        return this.http.get(this.config.dataUrl + 'GetFuturesPrice/' + productId)
            .map(this.extractFuturePriceData)
            .catch(this.handleError);    
    }

    private extractFuturePriceData(res: Response) 
    {
        let data = res.json() || [];

        //Convert 
        let prices = new Array<FuturePrice>();
        data.forEach((f: IFuturePrice) => {prices.push(FuturePrice.fromIFP(f))});
        return prices;
    }
}

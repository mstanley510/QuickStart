import { Injectable }   from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/map';

import {Logger} from './logger.service';
import {Config} from './config.service';

import {FuturePriceServer} from './future-price-server';
import {Product} from "../Entities/Product";
import {FuturePrice}        from "../Entities/FuturePrice";
import {IFuturePrice}        from "../Entities/FuturePrice";

@Injectable()
export class StaticFuturePriceServer extends FuturePriceServer {

    constructor(private http: Http, config: Config, logger: Logger)
    {
        super(config, logger);
    }

    getFuturePrices(product:Product): Observable<FuturePrice[]>
    {
        this.logger.log('Getting product ' + product.ID + ' future prices from server...');
        return this.http.get(this.config.dataUrl + 'GetFuturesPrice/' + product.ID)
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

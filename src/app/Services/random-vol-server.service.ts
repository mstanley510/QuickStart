import { Injectable }   from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/publish';

import {Logger} from './logger.service';
import {Config} from './config.service';

import {VolServer} from './vol-server';
import {StaticVolServer} from './static-vol-server.service';
import {Product} from "../Entities/Product";
import {Curves, ICurves, ICurveItem} from "../Entities/VolCurve";

@Injectable()
export class RandomVolServer extends StaticVolServer {

    private items:VolItem[] = null;

    constructor(http: Http, config: Config, logger: Logger)
    {
        super(http, config, logger);
        this.items = new Array<VolItem>();
    }

    getVolatility(product: Product): Observable<Curves[]>
    {
        let item = this.items.find(x => x.productId == product.ID);
        if (item == null){
            item = this.addItem(product);
            this.items.push(item);
        }

        //return item.subject;
        return item.observable;
    }

    private addItem(product:Product):VolItem{
        let item = new VolItem();
        item.productId = product.ID;
        item.observable = Observable.combineLatest(
            super.getVolatility(product),
            Observable.interval(product.volRefreshInterval).startWith(0),
            function(s1, s2){
                console.log('Generating random volatility...');
                s1.forEach((x:Curves) => {
                    if (x.Moneyness.Current != null)
                    {
                        let atm:number = x.Moneyness.Current.Coefficients[0]*(1 + 0.1 * (Math.random() - 0.5));
                        let atmChange:number = x.Moneyness.Current.Coefficients[0] - atm;
                        x.Moneyness.Current.Coefficients[0] = atm;

                        if (x.Strike.Current != null)
                            x.Strike.Current.Coefficients[0] += atmChange;
                    }
                });
                return s1;
            }
        ).publish().refCount();

        return item;
    }
}

class VolItem {
    productId:number;
    observable:Observable<Curves[]>;
}


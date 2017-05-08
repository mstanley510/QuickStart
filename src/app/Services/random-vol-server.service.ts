import { Injectable }   from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { ConnectableObservable } from 'rxjs/Observable/ConnectableObservable';
import 'rxjs/add/operator/publish';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/map';

import {Logger} from './logger.service';
import {Config} from './config.service';

import {VolServer} from './vol-server';
import {StaticVolServer} from './static-vol-server.service';
import {Product} from "../Entities/Product";
import {Curves, ICurves, ICurveItem} from "../Entities/VolCurve";

@Injectable()
export class RandomVolServer extends StaticVolServer {

    private observable:ConnectableObservable<Curves[]> = null;

    constructor(http: Http, config: Config, logger: Logger)
    {
        super(http, config, logger);
    }

    getVolatility(product: Product): Observable<Curves[]>
    {
        if (this.observable == null)
        {
            this.observable = Observable.combineLatest(
                super.getVolatility(product),
                Observable.interval(product.volRefreshInterval).startWith(0),
                function(s1, s2){
                    s1.forEach((x:Curves) => {
                        let atm:number = x.Moneyness.Current.Coefficients[0]*(1 + 0.1 * (Math.random() - 0.5));
                        let atmChange:number = x.Moneyness.Current.Coefficients[0] - atm;
                        x.Moneyness.Current.Coefficients[0] = atm;
                        x.Strike.Current.Coefficients[0] += atmChange;
                    });
                    return s1;
                }
            ).publish();

            this.observable.connect();
        }

        return this.observable;
    }
}

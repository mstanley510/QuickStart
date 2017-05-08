import { Injectable }   from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/map';

import {Logger} from './logger.service';
import {Config} from './config.service';

import {VolServer} from './vol-server';
import {Product} from "../Entities/Product";
import {Curves, ICurves, ICurveItem} from "../Entities/VolCurve";

@Injectable()
export class StaticVolServer extends VolServer {

    constructor(private http: Http, config: Config, logger: Logger)
    {
        super(config, logger);
    }

    getVolatility(product: Product): Observable<Curves[]>
    {
        this.logger.log('Getting product ' + product.ID + ' volatility from server...');
        return this.http.get(this.config.dataUrl + 'GetVolatility/' + product.ID)
            .map(x => this.extractVolatilityData(product, x))
            .catch(this.handleError);    
    }

    private extractVolatilityData(product:Product, res: Response) 
    {
        let data = res.json() || [];

        //Convert 
        console.log('Extracting volatility...');
        let curveItems = new Array<Curves>();
        data.forEach((curveItem: ICurveItem) => {curveItems.push(Curves.fromICurves(product, curveItem))});
        return curveItems;
    }
}

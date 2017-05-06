import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/catch';

import {Logger} from './logger.service';
import {Config} from './config.service';

import {Product} from "../Entities/Product";
import {Curves} from "../Entities/VolCurve";

export abstract class VolServer
{
    constructor(protected config: Config, protected logger: Logger){
    }

    abstract getVolatility(product: Product, interval: number) : Observable<Curves[]>;

    protected handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } 
    else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
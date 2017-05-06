import { Injectable }   from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { DataService } from './data-service.service';
import { Logger } from './logger.service';

import {Product}        from "../Entities/Product";
import {Future}        from "../Entities/Future";

@Injectable()
export class DataStore {

    constructor(private dataService: DataService, private logger: Logger){

    }

    private _products: Product[] = null;
    public get Products(): Observable<Product[]>
    {
        if (this._products == null) {
            return this.dataService.getProducts().map(products => this._products = products);
        }

        this.logger.log("Getting products from cache....");
        return new Observable<Product[]>((observer: Observer<Product[]>) => {observer.next(this._products)});
    }

}

import { Injectable }   from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { DataService } from './data-service.service';
import { Logger } from './logger.service';

import {Product}        from "../Entities/Product";

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
        return new Observable<Product[]>((observer: Observer<Product[]>) => {observer.next(this._products);observer.complete();});
        
    }

    // public getProduct(productId:number): Observable<Product>{
    //     let o1 = this.Products.map(x => x.find(y => y.ID == productId));
    //     let o2 = this.dataService.getFutures2(productId);
    //     let o3 = this.dataService.getExpirations2(productId);
    //     let o4 = this.dataService.getFuturePrices2(productId, this.futureRefreshInterval);
    //     let o5 = this.dataService.getVolatility2(productId, this.volRefreshInterval);
    //     let o6 = this.dataService.getAllStrikes(productId);

    //     return Observable.combineLatest(o1, o2, o3, o4, o5, o6,
    //         function(product, futures, expirations, futurePrices, volatility, strikes){ 

    //             product._futures = futures;
    //             futures.forEach((x)=>{
    //                 x.Product = product;
    //                 let fp = futurePrices.find(y => y.Symbol == x.Symbol);
    //                 if (fp != undefined)
    //                     x.Prices = fp;
    //             });

    //             product._expirations = expirations;
    //             expirations.forEach((x)=>{
    //                 x.Product = product;
    //                 x.Future = futures.find(y => y.Symbol == x.UnderlyingSymbol);
    //                 let v = volatility.find(y => y.ExpirationId == x.ID);
    //                 if (v != undefined)
    //                     x.VolCurves = v;
    //             });

    //             strikes.forEach((x)=>{
    //                 x.Expiration = product._expirations.find(y => y.ID == x.ExpirationId);
    //                 if (x.Expiration._strikes == null)
    //                     x.Expiration._strikes = new Array<Strike>();
    //                 x.Expiration._strikes.push(x);
    //                 x.Call.ensureCalcs = false;
    //                 x.Put.ensureCalcs = false;
    //             });

    //             return product;});
    // }

}

import { Injectable }   from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/map';

import {Logger} from './logger.service';
import {Config} from './config.service';

import {FuturePriceServer} from './future-price-server';
import {VolServer} from './vol-server';
import {Product} from "../Entities/Product";
import {IProduct} from "../Entities/Product";
import {Future} from "../Entities/Future";
import {IFuture} from "../Entities/Future";
import {FuturePrice} from "../Entities/FuturePrice";
import {IFuturePrice} from "../Entities/FuturePrice";
import {Expiration} from "../Entities/Expiration";
import {IExpiration} from "../Entities/Expiration";
import {Curves} from "../Entities/VolCurve";
import {ICurves} from "../Entities/VolCurve";
import {Strike} from "../Entities/Strike";
import {IStrike} from "../Entities/Strike";

@Injectable()
export class DataService {

    constructor(private http: Http, private futurePriceServer: FuturePriceServer, private volServer: VolServer, private config: Config, private logger: Logger)
    {}

    //----------------------- Products ------------------------------------------
    getProducts(): Observable<Product[]>
    {
        this.logger.log("Getting products from server...");
        return this.http.get(this.config.dataUrl + 'GetAllProducts')
            .map(this.extractProductData, this)
            .catch(this.handleError);    
    }

    private extractProductData(res: Response) 
    {
        let data = res.json() || [];
        console.log("Extracting products...");
        let products = new Array<Product>();
        data.forEach((p: IProduct) => {products.push(Product.fromIProduct(p, this))});
        return products;
    }

    //------------------------ Futures -------------------------------------------
    getFutures(product: Product): Observable<Future[]>
    {
        this.logger.log('Getting product ' + product.ID + ' futures from server...');
        return this.http.get(this.config.dataUrl + 'GetFutures/' + product.ID)
            .map(x => this.extractFutureData(product, x))
            .catch(this.handleError);    
    }

    private extractFutureData(product: Product, res: Response) 
    {
        this.logger.log('Extracting product ' + product.ID + ' futures...')
        let data = res.json() || [];

        //Convert 
        let futures = new Array<Future>();
        data.forEach((f: IFuture) => {futures.push(Future.fromIFuture(product, f))});
        return futures;
    }

    getFuturePrices(product: Product, interval: number): Observable<FuturePrice[]>
    {
        return this.futurePriceServer.getFuturePrices(product);
    }

    //-------------------------- Expirations --------------------------------------------
    getExpirations(product: Product): Observable<Expiration[]>
    {
        this.logger.log('Getting product ' + product.ID + ' expirations from server...');
        return this.http.get(this.config.dataUrl + 'GetExpirations/' + product.ID)
            .map(x => this.extractExpirationData(product, x), this)
            .catch(this.handleError);    
    }

    private extractExpirationData(product: Product, res: Response) 
    {
        let data = res.json() || [];

        //Convert 
        this.logger.log('Extracting product ' + product.ID + ' expirations...')
        let expirations = new Array<Expiration>();
        data.forEach((e: IExpiration) => {expirations.push(Expiration.fromIExpiration(product, e, this))});
        return expirations;
    }

    getVolatility(product: Product): Observable<Curves[]>{
        return this.volServer.getVolatility(product);
    }

    //--------------------------- Strikes --------------------------------------------------
    getStrikes(expiration: Expiration): Observable<Strike[]>
    {
        this.logger.log('Getting expiration ' + expiration.ID + ' strikes from server...');
        return this.http.get(this.config.dataUrl + 'GetStrikes/' + expiration.ID)
            .map(x => this.extractStrikeData(expiration, x))
            .catch(this.handleError);    
    }

    private extractStrikeData(expiration: Expiration, res: Response) 
    {
        let data = res.json() || [];

        //Convert 
        let strikes = new Array<Strike>();
        data.forEach((s: IStrike) => {strikes.push(Strike.fromIStrike(expiration, s))});
        return strikes;
    }

    // getAllStrikes(productId:number): Observable<Strike[]>
    // {
    //     this.logger.log('Getting product ' + productId + ' strikes from server...');
    //     return this.http.get(this.config.dataUrl + 'GetAllStrikes/' + productId)
    //         .map(x => this.extractStrikeData2(x))
    //         .catch(this.handleError);    
    // }

    // private extractStrikeData2(res: Response) 
    // {
    //     let data = res.json() || [];

    //     //Convert 
    //     let strikes = new Array<Strike>();
    //     data.forEach((s: IStrike) => {strikes.push(Strike.fromIStrike2(s))});
    //     return strikes;
    // }













    private handleError (error: Response | any) {
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

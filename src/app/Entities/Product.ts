import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { DataService } from '../Services/data-service.service';

import {Future} from "./Future";
import {FuturePrice} from "./FuturePrice";
import {Expiration} from "./Expiration";
import {Curves} from "./VolCurve";
import {ModelType} from "../PricingModels/pricing-model";

export class Product 
{
    ID : number;
    Abbreviation: string;
    Name: string;
    Description: string;
    LastSettlementDate: Date;
    ModelType:ModelType;
    IsIndexed:boolean;

    futureRefreshInterval: number = 3000;
    volRefreshInterval: number = 3000;

     _futures:Future[] = null;
    get Futures(): Observable<Future[]> {

        if (this._futures == null)
            return this.dataService.getFutures(this).map(futures => this._futures = futures);

        console.log('Getting product ' + this.ID + ' futures from cache....');
        return Observable.of(this._futures);
    }

    get LiveFutures():Observable<Future[]>{
        return Observable.combineLatest(
            this.Futures, 
            this.dataService.getFuturePrices(this, this.futureRefreshInterval),
            this.mergeFuturePrices);
    }

    mergeFuturePrices(futures:Future[], prices:FuturePrice[]):Future[]{
        futures.forEach((f: Future) => {
            f.Prices = prices.find(x => x.Symbol == f.Symbol)
            //console.log('Set future price for ' + f.Symbol + ' on ' + f.Prices);
        });
        return futures;
    }

    private _expirations:Expiration[] = null;
    get Expirations(): Observable<Expiration[]>{

        if (this._expirations == null)
        {
            //Need to ensure futures are in the cache....so concat the Futures stream with the Expirations then filter out the futures
            //Maybe there is an easier way???
            return this.Futures
                .concat(this.dataService.getExpirations(this).map(expirations => this._expirations = expirations))
                .filter((x, i) => { 
                    if (x.length > 0)
                        return x[0] instanceof Expiration;
                    return false;})
        }

        console.log('Getting product ' + this.ID + ' expirations from cache....');
        return Observable.of(this._expirations);
    }

    get LiveExpirations(): Observable<Expiration[]>{

        let o1 = this.Expirations;
        let o2 = this.dataService.getVolatility(this, this.volRefreshInterval);

        return Observable.combineLatest(
            o1, 
            o2, 
            function(expirations, curves) {

                if (expirations.length == 0)
                    return expirations;

                expirations.forEach((e: Expiration) => {
                    e.VolCurves = curves.find(x => x.ExpirationId == e.ID)});

                // strikes.forEach((x) => {

                //     x.Call.ensureCalcs = false;
                //     x.Put.ensureCalcs = false;
                // });

                return expirations;
            });
    }

    constructor (private dataService: DataService){
    }

    public static fromIProduct(ip: IProduct, dataService: DataService): Product{
        let p = new Product(dataService);
        p.ID = ip.ProductId;
        p.Abbreviation = ip.Abbreviation;
        p.Name = ip.Name;
        p.Description = ip.Description;
        p.LastSettlementDate = new Date(parseInt(ip.LastSettlementDate.substr(6)));
        p.ModelType = ip.Model as ModelType;
        p.IsIndexed = ip.YieldVol;
        return p;
    }
}

export interface IProduct
{
    ProductId: number;
    Abbreviation: string;
    Name: string;
    Description: string;
    LastSettlementDate: string; 
    Model:number;
    YieldVol:boolean;
}



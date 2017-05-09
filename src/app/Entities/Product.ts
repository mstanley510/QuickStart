import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';

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
    DefaultStrikeInterval:number;

    useLiveFutures = true;
    useLiveVolatility = true;
    futureRefreshInterval: number = 3000;
    volRefreshInterval: number = 5000;

     _futures:Future[] = null;
    get Futures(): Observable<Future[]> {

        if (this._futures == null)
        {
            if (this.useLiveFutures)
            {
                console.log('Calling server for product ' + this.ID + ' LIVE futures...')
                return Observable.combineLatest(
                    this.dataService.getFutures(this).map(futures => this._futures = futures), 
                    this.dataService.getFuturePrices(this),
                    this.mergeFuturePrices)
            };

            console.log('Calling server for product ' + this.ID + ' STATIC futures ...');
            return this.dataService.getFutures(this).map(futures => this._futures = futures);
        }

        if (this.useLiveFutures)
        {
            console.log('Getting product ' + this.ID + ' LIVE futures from cache....');
            return Observable.combineLatest(
                Observable.of(this._futures), 
                this.dataService.getFuturePrices(this),
                this.mergeFuturePrices);
        }

        console.log('Getting product ' + this.ID + ' STATIC futures from cache...');
        return Observable.of(this._futures);
    }

    mergeFuturePrices(futures:Future[], prices:FuturePrice[]):Future[]{
        //console.log('Merging future prices...');
        futures.forEach((f: Future) => {
            f.Prices = prices.find(x => x.Symbol == f.Symbol)
        });
        return futures;
    }

     _expirations:Expiration[] = null;
    get Expirations(): Observable<Expiration[]>{

        if (this._expirations == null)
        {
            if (this.useLiveVolatility)
            {
                console.log('Calling server for product ' + this.ID + ' LIVE expirations...');
                return Observable.combineLatest(
                    this.Futures,
                    this.dataService.getExpirations(this).map(expirations => this._expirations = expirations),
                    this.dataService.getVolatility(this),
                    (futures, expirations, volatility) => { 
                        expirations.forEach((x) => {x.Lasts._results = null;});
                        return this.mergeVolatility(expirations, volatility);}
                );
            }

            console.log('Calling server for product ' + this.ID + ' STATIC expirations ...');
            return Observable.combineLatest(
                this.Futures,
                this.dataService.getExpirations(this).map(expirations => this._expirations = expirations),
                (futures, expirations) => { 
                    expirations.forEach((x) => {x.Lasts._results = null;});
                    return expirations;}
            );
        }

        if (this.useLiveVolatility)
        {
            //There is an extra merge Volatility being called here.
            //It is due to the fact that a FuturePrice update causes a new sequence element to emit but I can't
            //tell the difference between a FuturePrice update and a volatility update so I have to run the mergeVolatility
            //routine all the time......not smart enough to figure out a way around it. NOTE: tried the .withLatestFrom below but had no effect.

            console.log('Getting product ' + this.ID + ' LIVE expirations from cache...');
            return Observable.combineLatest(
                this.Futures,
                Observable.of(this._expirations),
                this.dataService.getVolatility(this),
                (futures, expirations, volatility) => { 
                    this.mergeVolatility(expirations, volatility);
                    expirations.forEach((x) => {x.Lasts._results = null;});
                    console.log('resetting');
                    return expirations;
                }
            );


            // return Observable.combineLatest(
            //     Observable.of(this._expirations),
            //     this.dataService.getVolatility(this),
            //     (expirations, volatility) => {return this.mergeVolatility(expirations, volatility);})
            //     .withLatestFrom(this.Futures, (s1, s2) => {return s1});
        }

        console.log('Getting product ' + this.ID + ' STATIC expirations from cache....');
        return Observable.combineLatest(
            this.Futures,
            Observable.of(this._expirations),
            (futures, expirations) => { 
                console.log('resetting');
                expirations.forEach((x)=>{x.Lasts._results = null;});
                return expirations;});
    }

    mergeVolatility(expirations:Expiration[], curves:Curves[]):Expiration[]{
        //console.log('Merging volatility...');
        expirations.forEach((e: Expiration) => {
            e.VolCurves = curves.find(x => x.ExpirationId == e.ID)});

        return expirations;
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
        p.DefaultStrikeInterval = ip.DefaultStrikeInterval;
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
    DefaultStrikeInterval:number;
}



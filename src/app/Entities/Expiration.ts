import { Observable } from 'rxjs/Observable';

import { DataService } from '../Services/data-service.service';

import {Product} from "./Product";
import {Future} from "./Future";
import {Strike} from "./Strike";
import {Curves} from "./VolCurve";
import {OptionCalculator} from "../PricingModels/option-calculator";
import {ModelParameters} from "../PricingModels/pricing-model";

export class Expiration 
{    
    Product: Product;
    Future: Future;
    ID : number;
    Symbol : string;
    Description: string;
    ExpirationDate : Date;
    InterestRate: number;

    VolCurves:Curves;

    private _strikes:Strike[] = null;
    get Strikes(): Observable<Strike[]>{

        if (this._strikes == null)
            return this.dataService.getStrikes(this).map(strikes => this._strikes = strikes);

        return Observable.of(this._strikes);
    }

    private _liveStrikes:Strike[] = null;
    get LiveStrikes(): Observable<Strike[]>{

        let o1 = this.Strikes;
        let o2 = this.dataService.getFuturePrices(this.Product, this.Product.futureRefreshInterval);

        return Observable.combineLatest(
            o1, 
            o2, 
            function(strikes, futurePrices) {

                if (strikes.length == 0)
                    return strikes;

                let ex = strikes[0].Expiration;
                let p = ex.Product;
                p.mergeFuturePrices(p._futures, futurePrices);
                console.log('merged future prices...');       

                strikes.forEach((x) => {

                    x.Call.ensureCalcs = false;
                    x.Put.ensureCalcs = false;
                });

                return strikes;
            }).map(strikes => this._liveStrikes = strikes);
    }

    constructor (private dataService: DataService){
        this.VolCurves = new Curves();
    }

    get DTE():number{
        return (this.ExpirationDate.getTime() - new Date().getTime()) / 86400000;
    }

    get ATMSettle():Strike{
        let strike = this._strikes.find(x => x.IsSettleATM);

        if (strike == null)
            return this._strikes[0];

        return strike;
    }

    // get ATMStrike():Strike{

    //     let min = Math.min.apply(Math, this._liveStrikes.map(function(o){return o.SMinusX;}))
    //     return this._liveStrikes.find(function(o){ return o.SMinusX == min; })
    // }

    private _modelParameters:ModelParameters = null;
    get ModelParameters():ModelParameters{
        if (this._modelParameters == null)
        {
            this._modelParameters = new ModelParameters();
            this._modelParameters.indexedProduct = this.Product.IsIndexed;
            this._modelParameters.modelType = this.Product.ModelType;
        }

        return this._modelParameters;
    }

    private _optionCalculator:OptionCalculator = null;
    get OptionCalculator():OptionCalculator{
        if (this._optionCalculator == null)
            this._optionCalculator = new OptionCalculator(this.ModelParameters);

        return this._optionCalculator;
    }

    static fromIExpiration(product: Product, ie: IExpiration, dataService: DataService): Expiration {
        let e = new Expiration(dataService);
        e.Product = product;
        e.ID = ie.ExpirationId;
        e.Symbol = ie.Symbol;
        e.Description = ie.Description;
        e.ExpirationDate = new Date(parseInt(ie.ExpirationDate.substr(6)));
        e.InterestRate = ie.InterestRate;

        //Hook the expiration to the future
        e.Future = product._futures.find(x => x.Symbol == ie.UnderlyingSymbol);
        //console.log('found future ' + e.Future.Symbol + ' for ' + e.Symbol);
        return e;
    }
}

export interface IExpiration
{
    ExpirationId: number;
    Symbol: string;
    UnderlyingSymbol:string;
    Description: string;
    ExpirationDate: string;
    InterestRate: number;
}
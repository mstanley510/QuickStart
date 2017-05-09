import {PricingModel} from './pricing-model';
import {ModelParameters} from './pricing-model';
import {Results} from './pricing-model';

export class Bachelier extends PricingModel
{
    constructor(modelParameters:ModelParameters){
        super(modelParameters);
    }

    Call(price:number, strike:number, rate:number, days:number, vol:number, calcGreeks:boolean): Results {

        if (calcGreeks == undefined) calcGreeks = true;

        let T = days / 365;
        let ST = Math.sqrt(T);
        let d = (price - strike) / (vol * ST);
        let NPrime = this.ND(d);

        let BCall = vol * ST * (d * this.CND(d) + NPrime);

        let results = new Results();

        results.Premium = Math.exp(-1 * rate * T) * BCall;

        if (vol == 0 || ST == 0)
            results.Premium = price > strike ? price - strike : 0;

        if (calcGreeks)
        {
            if (vol == 0 || ST == 0) {
                results.Delta = strike < price ? 1 : 0;
                results.Gamma = 0;
                results.Vega = 0;
                results.Theta = 0;
            }
            else {
                results.Delta = this.CND(d);
                results.Gamma = NPrime / (vol * ST);
                results.Vega = NPrime * ST / 100;
                results.Theta = -1 * vol * NPrime / (2 * ST * 365);
            }
        }

        return results;
    }

    Put(price:number, strike:number, rate:number, days:number, vol:number, calcGreeks:boolean): Results {

        if (calcGreeks == undefined) calcGreeks = true;

        let T = days / 365;
        let ST = Math.sqrt(T);
        let d = (price - strike) / (vol * ST);
        let NPrime = this.ND(d);

        let BCall = vol * ST * (d * this.CND(d) + NPrime);
        let BPut = vol * ST * (-1 * d * this.CND(-1 * d) + NPrime);

        let results = new Results();

        results.Premium = Math.exp(-1 * rate * T) * BPut;

        if (vol == 0 || ST == 0)
            results.Premium = price < strike ? strike - price : 0;

        if (calcGreeks)
        {
            if (vol == 0 || ST == 0) {
                results.Delta = price < strike ? -1 : 0;
                results.Gamma = 0;
                results.Vega = 0;
                results.Theta = 0;
            }
            else {
                results.Delta = -1 * this.CND(-1 * d);
                results.Gamma = NPrime / (vol * ST);
                results.Vega = NPrime * ST / 100;
                results.Theta = -1 * vol * NPrime / (2 * ST * 365);
            }
        }

        return results;
    }
}
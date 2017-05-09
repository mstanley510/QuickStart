import {Expiration} from "./Expiration";
import {OptionType} from "./../PricingModels/pricing-model"
import {Results} from "./../PricingModels/pricing-model"

export class ATMLasts
{
    Expiration: Expiration;

    constructor(expiration:Expiration){
        this.Expiration = expiration;
    }

    get Strike():number{
        return this.Expiration.Product.DefaultStrikeInterval * Math.round(this.Expiration.Future.Prices.Last / this.Expiration.Product.DefaultStrikeInterval);
    }

    get Vol():number{
        return this.Expiration.VolCurves.Moneyness.Current == null ? 0 : this.Expiration.VolCurves.Moneyness.Current.F(0);
    }

    get Premium():number{
        return this.Results.Premium;
    }

    get Delta():number{
        return this.Results.Delta;
    }

    get Gamma():number{
        return this.Results.Gamma;
    }

    get Vega():number{
        return this.Results.Vega;
    }

    get Theta():number{
        return this.Results.Theta;
    }

    _results:Results = null;
    get Results():Results{

        if (this._results == null)
        {
            this._results = this.Expiration.OptionCalculator.Calculate(OptionType.Straddle, 
            this.Expiration.Future.Prices.Last, 
            this.Strike, 
            this.Expiration.InterestRate, 
            this.Expiration.DTE, 
            this.Vol); 
            console.log('Recalculating...');
        }
        return this._results;
    }    
}
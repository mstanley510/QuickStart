import {Expiration} from "./Expiration";
import {OptionType} from "./../PricingModels/pricing-model"
import {Results} from "./../PricingModels/pricing-model"

export class ATMSettles
{
    Expiration: Expiration;

    constructor(expiration:Expiration){
        this.Expiration = expiration;
    }

    get Strike():number{
        return this.Expiration.Product.DefaultStrikeInterval * Math.round(this.Expiration.Future.Prices.Settle / this.Expiration.Product.DefaultStrikeInterval);
    }

    get Vol():number{
        return this.Expiration.VolCurves.Moneyness.Settle == null ? 0 : this.Expiration.VolCurves.Moneyness.Settle.F(0);
    }
}

import {Expiration} from "./Expiration";

export class ATMStrike
{
    Expiration: Expiration;

    constructor(expiration:Expiration){
        this.Expiration = expiration;
    }

    get Last():number{
        return this.Expiration.Product.DefaultStrikeInterval * Math.round(this.Expiration.Future.Prices.Last / this.Expiration.Product.DefaultStrikeInterval);
    }

    get Settle():number{
        return this.Expiration.Product.DefaultStrikeInterval * Math.round(this.Expiration.Future.Prices.Settle / this.Expiration.Product.DefaultStrikeInterval);
    }
}
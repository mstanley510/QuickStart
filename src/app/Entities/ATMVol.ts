
import {Expiration} from "./Expiration";

export class ATMVol
{
    Expiration: Expiration;

    constructor(expiration:Expiration){
        this.Expiration = expiration;
    }

    get Last():number{
        return this.Expiration.VolCurves.Moneyness.Current == null ? 0 : this.Expiration.VolCurves.Moneyness.Current.F(0);
    }

    get Settle():number{
        return this.Expiration.VolCurves.Moneyness.Settle == null ? 0 : this.Expiration.VolCurves.Moneyness.Settle.F(0);
    }
}
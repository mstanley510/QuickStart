
import {Expiration} from "./Expiration";
import {OptionType} from "./../PricingModels/pricing-model"
import {Results} from "./../PricingModels/pricing-model"

export class Strike
{
    Expiration: Expiration;
    ExpirationId: number;
    ID: number;
    StrikePrice: number;
    SettleVol:number;
    SettleType:number;
    Call: Call;
    Put: Put;

    get IsSettleATM():boolean{
        return this.SettleType == 2;
    }
    
    get SMinusX():number{
        return this.Expiration.Future.Prices.Last - this.StrikePrice;
    }

    get Vol():number{
        
        if (this.Expiration.VolCurves.Strike.Current == null)
            return 0;

        return this.Expiration.VolCurves.Strike.Current.F(this.StrikePrice);
    }
    
    constructor() {
    }

    public static fromIStrike(expiration: Expiration, is: IStrike): Strike{
        let s = new Strike();
        s.Expiration = expiration;
        s.ID = is.StrikeId;
        s.StrikePrice = is.StrikePrice;
        s.SettleVol = is.SettleVolatility;
        s.SettleType = is.OptionTypeSettle;

        s.Call = new Call(s);
        s.Call.Strike = s;
        s.Call.Settle = is.SettleCall;
        s.Call.OI = is.OpenInterestCall;
        s.Call.Volume = is.VolumeCall;

        s.Put = new Put(s);
        s.Put.Strike = s;
        s.Put.Settle = is.SettlePut;
        s.Put.OI = is.OpenInterestPut;
        s.Put.Volume = is.VolumePut;

        return s;
    }
}

export interface IStrike
{
    StrikeId: number;
    ExpirationId: number;
    StrikePrice: number;
    SettleCall: number;
    SettlePut: number;
    SettleVolatility: number;
    OptionTypeSettle:number;
    OpenInterestCall: number;
    OpenInterestPut: number;
    VolumeCall: number;
    VolumePut: number;
}

export abstract class Option
{
    ensureCalcs:boolean = false;

    Strike: Strike;
    Settle: number;
    OI: number;
    Volume: number;

    abstract OptionType: OptionType;
    
    private _last:number;
    get Last():number{
        if (!this.ensureCalcs)
            this.Calculate();

        return this._last;
    }

    private _delta:number;
    get Delta():number{
        if (!this.ensureCalcs)
            this.Calculate();

        return this._delta;
    }

    private _gamma:number;
    get Gamma():number{
        if (!this.ensureCalcs)
            this.Calculate();

        return this._gamma;
    }

    private _vega:number;
    get Vega():number{
        if (!this.ensureCalcs)
            this.Calculate();

        return this._vega;
    }

    private _theta:number;
    get Theta():number{
        if (!this.ensureCalcs)
            this.Calculate();

        return this._theta;
    }

    constructor(strike:Strike){

    }

    protected Calculate(): void{

        this.ensureCalcs = true;

        let results = this.Strike.Expiration.OptionCalculator.Calculate(this.OptionType, 
            this.Strike.Expiration.Future.Prices.Last, 
            this.Strike.StrikePrice, 
            this.Strike.Expiration.DTE, 
            this.Strike.Expiration.InterestRate, 
            this.Strike.Vol); 

        this._last = results.Premium;
        this._delta = results.Delta;
        this._gamma = results.Gamma;
        this._vega = results.Vega;
        this._theta = results.Theta;
    }

}

export class Call extends Option
{
    OptionType:OptionType = OptionType.Call;
}

export class Put extends Option
{
    OptionType:OptionType = OptionType.Put;
}
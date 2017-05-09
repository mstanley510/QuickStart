import {PricingModel} from './pricing-model';
import {ModelParameters} from './pricing-model';
import {Results} from './pricing-model';
import {OptionType} from './pricing-model';

class Factors
{
    dPartSqr:number;
    dT1:number;
    dT2:number;
    dT3:number;
    dA4:number;
    dB4:number;
}

export class GBlackScholes extends PricingModel
{
    constructor(modelParameters:ModelParameters){
        super(modelParameters);
    }

    Call(price:number, strike:number, rate:number, days:number, vol:number, calcGreeks:boolean): Results {
        
        if (calcGreeks == undefined) calcGreeks = true;

        let S = price;		
        let X = strike;		
        let T = days/365; //convert from days to years 
        let r = rate ;		
        let v = vol;

        let b = this.modelParameters.GBSReturn;
        let d1 = (Math.log(S / X) + (b + Math.pow(v , 2) / 2.0) * T) / (v * Math.sqrt(T));
        let d2 = d1 - v * Math.sqrt(T);
        let temp1 = Math.exp((b - r) * T);
        let temp2 = this.CND(d1);
        let temp3 = Math.exp(-r * T);
        let temp4 = this.CND(d2);

        let results = new Results();
        results.Premium = S * temp1 * temp2 - X * temp3 * temp4;

        if (calcGreeks)
        {
            results.Delta = this.GDelta( OptionType.Call , S,  X,  T,  r,  b,  v);
            results.Gamma = this.GGamma(  S,   X,   T,   r,   b,   v);
            results.Vega = this.GVega(  S,   X,   T,   r,   b,   v) / 100; 
            results.Theta = this.GTheta( OptionType.Call , S,  X,  T,  r,  b,  v);
        }

        return results;
    }

    Put(price:number, strike:number, rate:number, days:number, vol:number, calcGreeks:boolean): Results {

        if (calcGreeks == undefined) calcGreeks = true;

        let S = price;
        let X = strike;		
        let T = days/365; //convert from days to years 
        let r = rate ;		
        let v = vol;

        let b = this.modelParameters.GBSReturn;
        let d1 = (Math.log(S / X) + (b + Math.pow(v , 2) / 2.0) * T) / (v * Math.sqrt(T));
        let d2 = d1 - v * Math.sqrt(T);

        let results = new Results();
        results.Premium = X * Math.exp(-r * T) * this.CND(-d2) - S * Math.exp((b - r) * T) * this.CND(-1 * d1);

        if (calcGreeks != null)
        {
            results.Delta = this.GDelta( OptionType.Put , S,  X,  T,  r,  b,  v);
            results.Gamma = this.GGamma(  S,   X,   T,   r,   b,   v);
            results.Vega = this.GVega(  S,   X,   T,   r,   b,   v) / 100; 
            results.Theta = this.GTheta( OptionType.Put , S,  X,  T,  r,  b,  v);
        }

        return results;
    }



    protected GetDelta(optionType:OptionType, dPrice:number, dStrike:number, dRate:number, dDays:number, dVol:number):number
    {
        if ((optionType != OptionType.Put) && (optionType != OptionType.Call))
            throw "GetDelta only works for Call and Put";

        let b = this.modelParameters.GBSReturn;

        return this.GDelta(optionType, dPrice, dStrike, dRate, dDays / 365, b, dVol);
    }

    protected GetGamma(optionType:OptionType, dPrice:number, dStrike:number, dRate:number, dDays:number, dVol:number):number
    {
        if ((optionType != OptionType.Put) && (optionType != OptionType.Call))
            throw "GetGamma only works for Call and Put";

        let b = this.modelParameters.GBSReturn;

        return this.GGamma(dPrice, dStrike, dRate, dDays / 365, b, dVol);
    }

    protected GetVega(optionType:OptionType, dPrice:number, dStrike:number, dRate:number, dDays:number, dVol:number):number
    {
        if ((optionType != OptionType.Put) && (optionType != OptionType.Call))
            throw "GetVega only works for Call and Put";

        let b = this.modelParameters.GBSReturn;

        return this.GVega(dPrice, dStrike, dRate, dDays / 365, b, dVol) / 100;
    }

    protected GetTheta(optionType:OptionType, dPrice:number, dStrike:number, dRate:number, dDays:number, dVol:number):number
    {
        if ((optionType != OptionType.Put) && (optionType != OptionType.Call))
            throw "GetTheta only works for Call and Put";

        let b = this.modelParameters.GBSReturn;

        return this.GTheta(optionType, dPrice, dStrike, dRate, dDays / 365, b, dVol);
    }

    protected GetRho(optionType:OptionType, dPrice:number, dStrike:number, dRate:number, dDays:number, dVol:number):number
    {
        let b = this.modelParameters.GBSReturn;

        return this.GRho(optionType, dPrice, dStrike, dRate, dDays / 365, b, dVol);
    }




























    private GDelta(otOptionType:OptionType, S:number, X:number, T:number, r:number, b:number, v:number):number
	{
        let d1 = (Math.log(S / X) + (b + Math.pow(v,2)/ 2.0) * T) / (v * Math.sqrt(T));
        
        if (otOptionType == OptionType.Call)
            return Math.exp((b - r) * T) * this.CND(d1);
        
        if (otOptionType == OptionType.Put )
            return Math.exp((b - r) * T) * (this.CND(d1) - 1);

        return 0;
	}

    private GGamma(S:number, X:number, T:number, r:number, b:number, v:number):number
    {
        let d1 = (Math.log(S / X) + (b + Math.pow(v,2) / 2.0) * T) / (v * Math.sqrt(T));
        
        let temp1 = Math.exp((b - r) * T);
        let temp2 = this.ND(d1);
        let temp3 = (S * v * Math.sqrt(T));
        return temp1 * temp2 / temp3;
    }

    private GVega(S:number, X:number, T:number, r:number, b:number, v:number):number
    {
        let d1 = (Math.log(S / X) + (b + Math.pow(v,2) / 2.0) * T) / (v * Math.sqrt(T));
        return S * Math.exp((b - r) * T) * this.ND(d1) * Math.sqrt(T);
    }


    private GTheta(optionType:OptionType, S:number, X:number, T:number, r:number, b:number, v:number):number
    {
        let d1 = (Math.log(S / X) + (b + Math.pow(v,2) / 2.0) * T) / (v * Math.sqrt(T));
        let d2 = d1 - v * Math.sqrt(T);

        let toReturn = 0;
        if (optionType == OptionType.Call)
        {
            toReturn = -S * Math.exp((b - r) * T) * this.ND(d1) * v / (2 * Math.sqrt(T)) - (b - r) * S * Math.exp((b - r) * T) * this.CND(d1) - r * X * Math.exp(-r * T) * this.CND(d2);
        }
        else if (optionType == OptionType.Put )
        {
            toReturn = -S * Math.exp((b - r) * T) * this.ND(d1) * v / (2 * Math.sqrt(T)) + (b - r) * S * Math.exp((b - r) * T) * this.CND(-d1) + r * X * Math.exp(-r * T) * this.CND(-d2);
        }
        return toReturn / 365;
    }

    private GRho(optionType:OptionType, S:number, X:number, T:number, r:number, b:number, v:number):number
    {
        let dGRho = 0;

        if (b == 0)
        {
            let dPremium = 0;

            if (optionType == OptionType.Call)
            {
                dPremium = this.Call(S, X, r, T * 365, v, false).Premium;
            }
            else if (optionType == OptionType.Put)
            {
                dPremium = this.Put(S, X, r, T * 365, v, false).Premium;
            }

            dGRho = -T * dPremium;
        }
        else
        {
            let d1 = (Math.log(S / X) + (b + v * v / 2) * T) / (v * Math.sqrt(T));
            let d2 = d1 - v * Math.sqrt(T);

            if (optionType == OptionType.Call)
            {
                dGRho = T * X * Math.exp(-r * T) * this.CND(d2);
            }
            else if (optionType == OptionType.Put)
            {
                dGRho = -T * X * Math.exp(-r * T) * this.CND(-d2);
            }
        }

        return dGRho;
    }

}


import {PricingModel} from './pricing-model';
import {ModelParameters} from './pricing-model';
import {GBlackScholes} from './gblack-scholes';
import {Results} from './pricing-model';
import {OptionType} from './pricing-model';

export class BSAmerican2002 extends PricingModel
{
    constructor(modelParameters:ModelParameters){
        super(modelParameters);
    }

    Call(price:number, strike:number, rate:number, days:number, vol:number, calcGreeks:boolean): Results {

        if (calcGreeks == undefined) calcGreeks = true;

        let dPremium:number;
        let S = price;
        let X = strike;
        let T = days / 365; // days convert to years
        let r = rate;
        let b = 0;
        let v = vol;

        let BInfinity;
        let B0;
        let ht1;
        let ht2;
        let I1;
        let I2;
        let alfa1;
        let alfa2;
        let Beta;
        let t1;
    
        t1 = 0.5 * (Math.sqrt(5) - 1) * T;
    
        if (b >= r)  // Never optimal to exersice before maturity
        {
            let gbs = new GBlackScholes(this.modelParameters);
            dPremium = gbs.Call(price, strike, rate, days, vol, false).Premium;
        }
        else
        {       
            Beta = (0.5 - b / (v * v)) + Math.sqrt(Math.pow((b / (v * v) - 0.5), 2) + 2 * r / (v * v));
            BInfinity = Beta / (Beta - 1) * X;
            B0 = Math.max(X, r / (r - b) * X);
        
            ht1 = -(b * t1 + 2 * v * Math.sqrt(t1)) * (X * X) / ((BInfinity - B0) * B0);
            ht2 = -(b * T + 2 * v * Math.sqrt(T)) * (X * X) / ((BInfinity - B0) * B0);
            I1 = B0 + (BInfinity - B0) * (1 - Math.exp(ht1));
            I2 = B0 + (BInfinity - B0) * (1 - Math.exp(ht2));
            alfa1 = (I1 - X) * Math.pow(I1, -Beta);
            alfa2 = (I2 - X) * Math.pow(I2, -Beta);
    
            if (S >= I2)
            {
                dPremium = S - X;
            }
            else
            {
                dPremium = alfa2 * Math.pow(S,Beta) - alfa2 * this.phi(S, t1, Beta, I2, I2, r, b, v)
                    + this.phi(S, t1, 1, I2, I2, r, b, v) - this.phi(S, t1, 1, I1, I2, r, b, v)
                    - X * this.phi(S, t1, 0, I2, I2, r, b, v) + X * this.phi(S, t1, 0, I1, I2, r, b, v)
                    + alfa1 * this.phi(S, t1, Beta, I1, I2, r, b, v) - alfa1 * this.ksi(S, T, Beta, I1, I2, I1, t1, r, b, v)
                    + this.ksi(S, T, 1, I1, I2, I1, t1, r, b, v) - this.ksi(S, T, 1, X, I2, I1, t1, r, b, v)
                    - X * this.ksi(S, T, 0, I1, I2, I1, t1, r, b, v) + X * this.ksi(S, T, 0, X, I2, I1, t1, r, b, v);
            }
        }


        let results = new Results();

        results.Premium = dPremium;

        if (calcGreeks)
        {
            results.Delta = this.GetDelta(OptionType.Call, price, strike, rate, days, vol);
            results.Gamma = this.GetGamma(OptionType.Call, price, strike, rate, days, vol);
            results.Vega = this.GetVega(OptionType.Call, price, strike, rate, days, vol);
            results.Theta = this.GetTheta(OptionType.Call, price, strike, rate, days, vol);
        }

        return results;
    }

    Put(price:number, strike:number, rate:number, days:number, vol:number, calcGreeks:boolean): Results {
        
        if (calcGreeks == undefined) calcGreeks = true;

        let results = new Results();

        results.Premium = this.Call(strike, price, rate, days, vol, false).Premium;

        if (calcGreeks) {
            results.Delta = this.GetDelta(OptionType.Put, price, strike, rate, days, vol);
            results.Gamma = this.GetGamma(OptionType.Put, price, strike, rate, days, vol);
            results.Vega = this.GetVega(OptionType.Put, price, strike, rate, days, vol);
            results.Theta = this.GetTheta(OptionType.Put, price, strike, rate, days, vol);
        }

        return results;
    }

}


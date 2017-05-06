import {PricingModel} from './pricing-model';
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

export class BlackScholes extends PricingModel
{
     Call(price:number, strike:number, days:number, rate:number, vol:number, calcGreeks:boolean): Results {
        
        if (calcGreeks == undefined) calcGreeks = true;

        let factors = this.GetFactors(OptionType.Call, price, strike, rate, days, vol);

        let results = new Results();
        results.Premium = factors.dT1 * (price * factors.dA4 - strike * factors.dB4);

        if (calcGreeks)
        {
            results.Delta = factors.dT1 * factors.dA4;
            results.Gamma = factors.dT1 * factors.dT2 / price / vol / factors.dPartSqr;
            results.Vega = price * factors.dT1 * factors.dPartSqr * factors.dT2 / 100;
            results.Theta = -(factors.dT1 * price * vol * factors.dT2 / 2 / factors.dPartSqr + strike * rate * factors.dT1 * factors.dT3 - price * rate * factors.dT1 * factors.dT2) / 365;
        }

        return results;
    }

    Put(price:number, strike:number, days:number, rate:number, vol:number, calcGreeks:boolean): Results {

        if (calcGreeks == undefined) calcGreeks = true;

        let factors = this.GetFactors(OptionType.Put, price, strike, rate, days, vol);

        let results = new Results();

        results.Premium = -(factors.dT1 * (price * factors.dA4 - strike * factors.dB4));

        if (calcGreeks)
        {
            results.Delta = -factors.dT1 * factors.dA4;
            results.Gamma = factors.dT1 * factors.dT2 / price / vol / factors.dPartSqr;
            results.Vega = price * factors.dT1 * factors.dPartSqr * factors.dT2 / 100;
            results.Theta = -(factors.dT1 * price * vol * factors.dT2 / 2 / factors.dPartSqr + strike * rate * factors.dT1 * (1 - factors.dT3) - price * rate * factors.dT1 * (1 - factors.dT2)) / 365;
        }

        return results;
    }

    private GetFactors(optionType:OptionType, price:number, strike:number, rate:number, days:number, vol:number):Factors
    {
        let dT1,dT2,dT3:number;
        let dA1,dA2,dA3,dA4:number;
        let dB1,dB2,dB3,dB4:number;
        let dD1,dD2:number;

        let dPartYear = days / 365;
        let dPartSqr = Math.sqrt(dPartYear);
        dT1 = Math.exp(-rate * dPartYear);


        if (optionType == OptionType.Put) {
            dD1 = -(Math.log(price / strike) + (vol * vol * days / 730)) / (vol * dPartSqr);
            dA1 = 1 / (Math.abs(dD1) * 0.33267 + 1);
            dA2 = dA1 * 0.4361836 - dA1 * dA1 * 0.1201676 + dA1 * dA1 * dA1 * 0.937298;
            dA3 = 1 - 0.3989423 * dA2 * Math.exp(-dD1 * dD1 / 2);

            if (dD1 < 0)
                dA4 = 1 - dA3;
            else
                dA4 = dA3;

            dD2 = -(Math.log(price / strike) - (vol * vol * days / 730)) / (vol * dPartSqr);
        }
        else {
            dD1 = (Math.log(price / strike) + (vol * vol * days / 730)) / (vol * dPartSqr);
            dA1 = 1 / (Math.abs(dD1) * 0.33267 + 1);
            dA2 = dA1 * 0.4361836 - dA1 * dA1 * 0.1201676 + dA1 * dA1 * dA1 * 0.937298;
            dA3 = 1 - 0.3989423 * dA2 * Math.exp(-dD1 * dD1 / 2);

            if (dD1 < 0)
                dA4 = 1 - dA3;
            else
                dA4 = dA3;

            dD2 = (Math.log(price / strike) - (vol * vol * days / 730)) / (vol * dPartSqr);
        }

        dB1 = 1 / (Math.abs(dD2) * 0.33267 + 1);
        dB2 = dB1 * 0.4361836 - dB1 * dB1 * 0.1201676 + dB1 * dB1 * dB1 * 0.937298;
        dB3 = 1 - 0.3989423 * dB2 * Math.exp(-dD2 * dD2 / 2);

        if (dD2 < 0)
            dB4 = 1 - dB3;
        else
            dB4 = dB3;

        dT2 = 0.3989423 * Math.exp(-dD1 * dD1 / 2);
        dT3 = 0.3989423 * Math.exp(-dD2 * dD2 / 2);

        let factors = new Factors();
        factors.dPartSqr = dPartSqr;
        factors.dA4 = dA4;
        factors.dB4 = dB4;
        factors.dT1 = dT1;
        factors.dT2 = dT2;
        factors.dT3 = dT3;

        return factors;
    }
}


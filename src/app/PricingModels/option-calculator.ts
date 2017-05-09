
import {ModelParameters, ModelType, OptionType, PricingModel, Results} from './pricing-model';
import {BlackScholes} from './black-scholes';
import {Bachelier} from './bachelier';
import {BSAmerican2002} from './bs-american-2002';

export class OptionCalculator
{
    private _pricingModel:PricingModel = null;
    private get pricingModel():PricingModel {

        if (this._pricingModel == null)
        {
            switch(this.modelParameters.modelType)
            {
                case ModelType.Black76:
                    this._pricingModel = new BlackScholes(this.modelParameters);
                    break;

                case ModelType.Bachelier:
                    this._pricingModel = new Bachelier(this.modelParameters);
                    break;

                case ModelType.BSAmerican2002:
                    this._pricingModel = new BSAmerican2002(this.modelParameters);
                    break;

                default:
                    throw 'Unexpected model type';
            }
        }

        return this._pricingModel;
    }

    constructor(private modelParameters:ModelParameters){
    }

    public Calculate(optionType:OptionType, price:number, strike:number, rate:number, days:number, vol:number):Results
    {
        if (!this.modelParameters.indexedProduct)
        {
            if (optionType == OptionType.Call)
                return this.pricingModel.Call(price, strike, rate, days, vol, true);

            if (optionType == OptionType.Put)
                return this.pricingModel.Put(price, strike, rate, days, vol, true);

            if (optionType == OptionType.Straddle)
            {
                let callResults = this.pricingModel.Call(price, strike, rate, days, vol, true);
                let putResults = this.pricingModel.Put(price, strike, rate, days, vol, true);

                let results = new Results();
                results.Premium = callResults.Premium + putResults.Premium;
                results.Delta = callResults.Delta + putResults.Delta;
                results.Gamma = callResults.Gamma + putResults.Gamma;
                results.Vega = callResults.Vega + putResults.Vega;
                results.Theta = callResults.Theta + putResults.Theta;
                
                return results;
            }
        }

        if (this.modelParameters.indexedProduct)
        {
            if (optionType == OptionType.Call)
            {
                let results = this.pricingModel.Put(100 - price, 100 - strike, rate, days, vol, true);
                results.Delta = -results.Delta;
                return results;
            }

            if (optionType == OptionType.Put)
            {
                let results = this.pricingModel.Call(100 - price, 100 - strike, rate, days, vol, true);
                results.Delta = -results.Delta;
                return results;
            }

            if (optionType == OptionType.Straddle)
            {
                let callResults = this.pricingModel.Call(100 - price, 100 - strike, rate, days, vol, true);
                let putResults = this.pricingModel.Put(100 - price, 100 - strike, rate, days, vol, true);

                let results = new Results();
                results.Premium = callResults.Premium + putResults.Premium;
                results.Delta = -1 * (callResults.Delta + putResults.Delta);
                results.Gamma = callResults.Gamma + putResults.Gamma;
                results.Vega = callResults.Vega + putResults.Vega;
                results.Theta = callResults.Theta + putResults.Theta;
                
                return results;                
            }
        }

    }
}
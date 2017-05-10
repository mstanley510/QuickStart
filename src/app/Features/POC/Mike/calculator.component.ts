import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {ModelParameters} from '../../../PricingModels/pricing-model';
import {PricingModel} from '../../../PricingModels/pricing-model';
import {BlackScholes} from '../../../PricingModels/black-scholes';
import {Bachelier} from '../../../PricingModels/bachelier';
import {BSAmerican2002}  from '../../../PricingModels/bs-american-2002';
import {Results} from '../../../PricingModels/pricing-model';

@Component({
  template: `
    <h1>Option Calculator</h1>
    <div class='container'>
        <div class='row'>
            <div class='col'>

                <div class='form-group'>
                    <label for='model'>Model:</label>
                    <select id='model' class='form-control' [(ngModel)]="selectedModel" (ngModelChange)="calculate()">
                        <option value="1">Bachelier</option>
                        <option value="2">Black &amp; Scholes</option>
                        <option value="3">B&amp;S American 2002</option>
                    </select>
                </div>
                <div class='form-group'>
                    <label for='future'>Future:</label>
                    <number-ticker id='future' class='form-control' [(value)]='future' [step]='1' [format]="futureFormat" (valueChange)="calculate()"></number-ticker>
                </div>
                <div class='form-group'>
                    <label>Strike:</label>
                    <number-ticker class='form-control' [(value)]='strike' [step]='1' [format]="strikeFormat" (valueChange)="calculate()"></number-ticker>
                </div>
                <div class='form-group'>
                    <label>Vol:</label>
                    <number-ticker class='form-control' [(value)]='vol' [step]='0.01' [format]="volFormat" (valueChange)="calculate()"></number-ticker>
                </div>
                <div class='form-group'>
                    <label>Rate:</label>
                    <number-ticker class='form-control' [(value)]='rate' [step]='0.001' [format]="rateFormat" (valueChange)="calculate()"></number-ticker>
                </div>
                <div class='form-group'>
                    <label>DTE:</label>
                    <number-ticker class='form-control' [(value)]='dte' [step]='1' [format]="dteFormat" (valueChange)="calculate()"></number-ticker>
                </div>


            </div>
            <div class='col'>

                <table class='table'>
                    <tr>
                        <th colspan='2'>Call</th>
                        <th colspan='2'>Put</th>
                    <tr>
                        <td>Price:</td>
                        <td>{{call.Premium | number:'1.4-4'}}</td>
                        <td>Price:</td>
                        <td>{{put.Premium | number:'1.4-4'}}</td>
                    </tr>
                    <tr>
                        <td>Delta:</td>
                        <td>{{call.Delta | number:'1.4-4'}}</td>
                        <td>Delta:</td>
                        <td>{{put.Delta | number:'1.4-4'}}</td>
                    </tr>
                    <tr>
                        <td>Gamma:</td>
                        <td>{{call.Gamma | number:'1.4-4'}}</td>
                        <td>Gamma:</td>
                        <td>{{put.Gamma | number:'1.4-4'}}</td>
                    </tr>
                    <tr>
                        <td>Vega:</td>
                        <td>{{call.Vega | number:'1.4-4'}}</td>
                        <td>Vega:</td>
                        <td>{{put.Vega | number:'1.4-4'}}</td>
                    </tr>
                    <tr>
                        <td>Theta:</td>
                        <td>{{call.Theta | number:'1.4-4'}}</td>
                        <td>Theta:</td>
                        <td>{{put.Theta | number:'1.4-4'}}</td>
                    </tr>
                </table>

            </div>
        </div>
    </div>


  `
})

export class CalculatorComponent implements OnInit
{  
    selectedModel:string = "1";
    future:number = 100;
    strike:number = 105;
    vol:number = 0.20;
    rate:number = 0.005;
    dte:number = 100;

    call:Results;
    put:Results;

    futureFormat:string = "1.1-1";
    strikeFormat:string = "1.0-0";
    volFormat:string = "1.2-2";
    rateFormat:string = "1.3-3";
    daysFormat:string = "1.0-0";

    ngOnInit(){
        this.calculate();
    }

    calculate():void{

        let pricingModel:PricingModel;
        switch(this.selectedModel)
        {
            case "1": pricingModel = new Bachelier(new ModelParameters()); break;
            case "2": pricingModel = new BlackScholes(new ModelParameters()); break;
            case "3": pricingModel = new BSAmerican2002(new ModelParameters()); break;
        }

        this.call = pricingModel.Call(this.future, this.strike, this.rate, this.dte, this.vol, true);
        this.put = pricingModel.Put(this.future, this.strike, this.rate, this.dte, this.vol, true);
    }
}

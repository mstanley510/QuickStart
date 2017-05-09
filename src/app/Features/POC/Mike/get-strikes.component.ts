import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/subscription';

import { DataStore } from '../../../Services/data-store.service';

import { Product } from "../../../Entities/Product";
import { Expiration } from "../../../Entities/Expiration";
import { Strike } from "../../../Entities/Strike";

@Component({
  template: `
    <h1>Get Strikes</h1>
    <div>{{errorMessage}}</div>
    <product-picker #ppicker></product-picker>
    <expiration-picker [product]="ppicker.selectedProduct" (onChange)="onExpirationPickerChange($event)"></expiration-picker>
    <span *ngIf="strikes">Last Future Price: {{strikes[0].Expiration.Future.Prices.Last | number}}</span>
    <span *ngIf="expiration">ATMVol: {{expiration.Lasts.Vol | number:'1.6-6'}}</span>
    <table>
        <tr>
            <th></th>
            <th></th>
            <th colspan='5'>Calls</th>
            <th></th>
            <th colspan='5'>Puts</th>
        </tr>
        <tr>
            <th>ID</th>
            <th>Vol</th>
            <th>OI</th>
            <th>Volume</th>
            <th>Settle</th>
            <th>Last</th>
            <th>Delta</th>
            <th>Strike</th>
            <th>Delta</th>
            <th>Last</th>
            <th>Settle</th>
            <th>Volume</th>
            <th>OI</th>
            <th>Gamma</th>
            <th>Vega</th>
            <th>Theta</th>
        </tr>
        <tr *ngFor="let strike of strikes">
            <td>{{strike.ID}}</td>
            <td>{{strike.Vol | number}}</td>
            <td>{{strike.Call.OI | number:'1.0'}}</td>
            <td>{{strike.Call.Volume | number:'1.0'}}</td>
            <td>{{strike.Call.Settle}}</td>
            <td>{{strike.Call.Last | number}}</td>
            <td>{{strike.Call.Delta | number}}</td>
            <td>{{strike.StrikePrice | number:'1.4-4' }}</td>
            <td>{{strike.Put.Delta | number}}</td>
            <td>{{strike.Put.Last | number}}</td>
            <td>{{strike.Put.Settle}}</td>
            <td>{{strike.Put.Volume | number:'1.0'}}</td>
            <td>{{strike.Put.OI | number:'1.0'}}</td>
            <td>{{strike.Call.Gamma | number}}</td>
            <td>{{strike.Call.Vega | number}}</td>
            <td>{{strike.Call.Theta | number}}</td>
        </tr>
    </table>

  `
})

export class GetStrikesComponent implements OnInit, OnDestroy
{  
    private subscription: Subscription;

    expiration: Expiration;
    strikes: Strike[];
    errorMessage: string;

    constructor(private dataStore: DataStore){
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void{
        if (this.subscription != null)
            this.subscription.unsubscribe();
    }

    onExpirationPickerChange(expiration: Expiration): void {

        console.log('changed');
        if (this.subscription != null)
            this.subscription.unsubscribe();

        this.expiration = expiration;
        this.loadStrikes(expiration);
    }

    loadStrikes(expiration:Expiration): void{
        if (expiration != null)
            this.subscription = expiration.Strikes.subscribe(strikes => this.strikes = strikes, error => this.errorMessage = <any>error);
    }
}

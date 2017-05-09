import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/subscription';

import { DataStore } from '../../../Services/data-store.service';

import { Product } from "../../../Entities/Product";
import { Expiration } from "../../../Entities/Expiration";
import { Curves } from "../../../Entities/VolCurve";

@Component({  template: `

    <h1>GetExpirations</h1>
    <product-picker (onChange)="onProductPickerChange($event)"></product-picker>

    <table>
        <tr>
            <td></td>
        </tr>
        <tr *ngFor="let curve of volcurves">
            <td>{{curve.Strike.Current.High}}</td>
        </tr>
    </table>

    <table>
        <tr>
            <th colspan='5'></th>
            <th colspan='2'>Future</th>
            <th colspan='2'>ATM Vol</th>
            <th colspan='2'>ATM Strike</th>
        </tr>
        <tr>
            <th>ID</th>
            <th>Symbol</th>
            <th>Description</th>
            <th>Expires</th>
            <th>DTE</th>
            <th>Last</th>
            <th>Settle</th>
            <th>Last</th>
            <th>Settle</th>
            <th>Last</th>
            <th>Settle</th>
            <th>Straddle</th>
            <th>Delta</th>
            <th>Gamma</th>
            <th>Vega</th>
            <th>Theta</th>
        </tr>
        <tr *ngFor="let expiration of expirations">
            <td>{{expiration.ID}}</td>
            <td>{{expiration.Symbol}}</td>
            <td>{{expiration.Description}}</td>
            <td>{{expiration.ExpirationDate | date:'shortDate'}}</td>
            <td><qs-dteticker [date]="expiration.ExpirationDate" [interval]="3000"></qs-dteticker></td>
            <td>{{expiration.Future.Prices.Last | number}}</td>
            <td>{{expiration.Future.Prices.Settle | number}}</td>
            <td>{{expiration.Lasts.Vol | number}}</td>
            <td>{{expiration.Settles.Vol | number}}</td>
            <td>{{expiration.Lasts.Strike}}</td>
            <td>{{expiration.Settles.Strike}}</td>
            <td>{{expiration.Lasts.Premium | number}}</td>
            <td>{{expiration.Lasts.Delta | number}}</td>
            <td>{{expiration.Lasts.Gamma | number}}</td>
            <td>{{expiration.Lasts.Vega | number}}</td>
            <td>{{expiration.Lasts.Theta | number}}</td>
        </tr>
    </table>
  `

})

export class GetExpirationsComponent implements OnInit {

    private expirations: Expiration[];
    private errorMessage: string;
    private subscription: Subscription;

    constructor(private dataStore: DataStore){
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void{

        if (this.subscription != null)
            this.subscription.unsubscribe();
    }

    onProductPickerChange(product: Product): void{

        if (this.subscription != null)
            this.subscription.unsubscribe();
        
        this.loadExpirations(product);
    }

    loadExpirations(product:Product): void{
        if (product != null)
            this.subscription = product.Expirations.subscribe(expirations => this.setExpirations(expirations), error => this.errorMessage = <any>error);
    }

    setExpirations(expirations:Expiration[]):void{
        console.log('received new ....');
        this.expirations = expirations;
    }


}
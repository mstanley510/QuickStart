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
        </tr>
        <tr *ngFor="let expiration of expirations">
            <td>{{expiration.ID}}</td>
            <td>{{expiration.Symbol}}</td>
            <td>{{expiration.Description}}</td>
            <td>{{expiration.ExpirationDate | date:'shortDate'}}</td>
            <td><qs-dteticker [date]="expiration.ExpirationDate" [interval]="3000"></qs-dteticker></td>
            <td>{{expiration.Future.Prices.Last | number}}</td>
            <td>{{expiration.Future.Prices.Settle | number}}</td>
            <td>{{expiration.ATMVol.Last | number}}</td>
            <td>{{expiration.ATMVol.Settle | number}}</td>
            <td>{{expiration.ATMStrike.Last}}</td>
            <td>{{expiration.ATMStrike.Settle}}</td>
        </tr>
    </table>
  `

})

export class GetExpirationsComponent implements OnInit {

    private expirations: Expiration[];
    private volcurves: Curves[];
    private errorMessage: string;
    private eSubscription: Subscription;

    constructor(private dataStore: DataStore){
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void{

        if (this.eSubscription != null)
            this.eSubscription.unsubscribe();
    }

    onProductPickerChange(product: Product): void{

        if (this.eSubscription != null)
            this.eSubscription.unsubscribe();
        
        this.loadExpirations(product);
    }

    loadExpirations(product:Product): void{
        if (product != null)
            //this.eSubscription = this.dataStore.getProduct(product.ID).subscribe(product => this.setExpirations(product));
            this.eSubscription = product.Expirations.subscribe(expirations => this.expirations = expirations, error => this.errorMessage = <any>error);
    }

    setExpirations(product:Product):void{
        console.log('received new ....');
        this.expirations = product._expirations;
    }


}
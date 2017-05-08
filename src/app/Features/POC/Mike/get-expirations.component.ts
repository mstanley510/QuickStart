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
            <th>ID</th>
            <th>Symbol</th>
            <th>Description</th>
            <th>ExpirationDate</th>
            <th>DTE</th>
            <th>InterestRate</th>
            <th>Future</th>
            <th>ATMVol</th>
        </tr>
        <tr *ngFor="let expiration of expirations">
            <td>{{expiration.ID}}</td>
            <td>{{expiration.Symbol}}</td>
            <td>{{expiration.Description}}</td>
            <td>{{expiration.ExpirationDate | date:'short'}}</td>
            <td><qs-dteticker [date]="expiration.ExpirationDate" [interval]="3000"></qs-dteticker></td>
            <td>{{expiration.InterestRate}}</td>
            <td>{{expiration.Future.Prices.Last | number}}</td>
            <td>{{expiration.ATMVol | number}}</td>
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
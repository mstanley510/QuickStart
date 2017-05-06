import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Subscription } from 'rxjs/subscription';

import { Product } from "../../../Entities/Product";
import { Future } from "../../../Entities/Future";
import { FuturePrice } from "../../../Entities/FuturePrice";

@Component({  template: `

    <h1>GetFutures</h1>
    {{errorMessage}}
    <product-picker (onChange)="onProductPickerChange($event)"></product-picker>
    
    <table>
        <tr>
            <th>ID</th>
            <th>Symbol</th>
            <th>Description</th>
            <th>ExpirationDate</th>
            <th>DTE</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Last</th>
        </tr>
        <tr *ngFor="let future of futures">
            <td>{{future.ID}}</td>
            <td>{{future.Symbol}}</td>
            <td>{{future.Description}}</td>
            <td>{{future.ExpirationDate | date:'shortDate'}}
            <td><qs-dteticker [date]="future.ExpirationDate" [interval]="3000"></qs-dteticker></td>
            <td>{{future.Prices.Open | number:'1.4-4'}}</td>
            <td>{{future.Prices.High | number:'1.4-4'}}</td>
            <td>{{future.Prices.Low | number:'1.4-4'}}</td>
            <td>{{future.Prices.Last | number:'1.4-4'}}</td>
        </tr>
    </table>

  `
})

export class GetFuturesComponent implements OnInit, OnDestroy {

    private futures: Future[];
    private errorMessage: string;
    private subscription: Subscription;

    constructor(){
    }

    ngOnInit(): void {
    }

    onProductPickerChange(product: Product): void{
        if (this.subscription != null)
            this.subscription.unsubscribe();
        this.loadFutures(product);
    }

    loadFutures(product:Product): void{
        if (product != null)
            this.subscription = product.LiveFutures.subscribe(futures => this.futures = futures, error => this.errorMessage = <any>error);
    }

    ngOnDestroy(): void{
        if (this.subscription != null)
            this.subscription.unsubscribe();
    }

}
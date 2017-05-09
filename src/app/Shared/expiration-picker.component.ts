import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs/subscription';

import { Product } from "../Entities/Product";
import { Expiration } from "../Entities/Expiration";

@Component({
    selector: 'expiration-picker',
    template: `
        <select [ngModel]="selectedValue" (ngModelChange)="onExpirationChange($event)">
            <option *ngFor="let expiration of expirations" value={{expiration.ID}}>{{expiration.Symbol}}</option>
        </select>
        {{message}}
    `
})

export class ExpirationPickerComponent implements OnInit, OnChanges
{  
    @Input() product:Product;
    @Output() onChange: EventEmitter<Expiration> = new EventEmitter<Expiration>();
 
    expirations: Expiration[];
    selectedExpiration: Expiration;
    message: string;
    subscription: Subscription;

    public get selectedValue(): string
    {
        if (this.selectedExpiration == null)
            return null;

        return this.selectedExpiration.ID.toString();
    }   

    public set selectedValue(value: string) {
        this.selectedExpiration = this.expirations.find(x => x.ID == +value);
    }

    constructor(){ 
    }

    public ngOnInit(): void{
    }

    public ngOnDestroy():void{
        if (this.subscription != null)
            this.subscription.unsubscribe();
    }

    public ngOnChanges(): void{

        if (this.subscription != null)
            this.subscription.unsubscribe();

        if (this.product != null)
            this.subscription = this.product.Expirations.subscribe(expirations => this.initExpirations(expirations));
    }

    initExpirations(expirations: Expiration[]){
        this.expirations = expirations;

        let current = this.expirations.find(x => x.ID == +this.selectedValue);
        if (current == null && expirations.length > 0){
            this.selectedValue = expirations[0].ID.toString();
        }
        this.onChange.emit(this.selectedExpiration);
    }

    onExpirationChange(newValue: number): void {
        this.selectedValue = newValue.toString();
        this.onChange.emit(this.selectedExpiration);
    }

}

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import {Product} from "../Entities/Product";
import { DataStore } from '../Services/data-store.service';

@Component({
    selector: 'product-picker',
    template: `
        <select [ngModel]="selectedValue" (ngModelChange)="onProductChange($event)">
            <option *ngFor="let product of products" value={{product.ID}}>{{product.Name}}</option>
        </select>
    `
})

export class ProductPickerComponent implements OnInit 
{  
    private errorMessage: string;
    private products: Product[];
    public selectedProduct: Product;

    @Output() onChange: EventEmitter<Product> = new EventEmitter<Product>();

    public get selectedValue(): string
    {
        if (this.selectedProduct == null)
            return null;

        return this.selectedProduct.ID.toString();
    }   

    public set selectedValue(value: string) {
        this.selectedProduct = this.products.find(x => x.ID == +value);
    }

    constructor(private dataStore: DataStore){ 
    }

    public ngOnInit(): void {  
        this.dataStore.Products.subscribe(products => this.initProducts(products), error => this.errorMessage = <any>error);
    }

    initProducts(products: Product[]){
        this.products = products;
        this.selectedValue = this.products[0].ID.toString();
        this.onChange.emit(this.selectedProduct);
    }

    onProductChange(newValue: number): void {
        this.selectedValue = newValue.toString();
        this.onChange.emit(this.selectedProduct);
    }
}

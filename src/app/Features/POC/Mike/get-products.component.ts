import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/subscription';

import { DataStore } from '../../../Services/data-store.service';

import { Product } from "../../../Entities/Product";

@Component({
  template: `
    <h1>GetProducts</h1>
    <div>{{errorMessage}}</div>
    <table>
      <tr>
        <th>ID</th>
        <th>Abbr</th>
        <th>Name</th>
        <th>Description</th>
        <th>LastSettle</th>
        <th>Model</th>
        <th>IsIndexed</th>
      </tr>
      <tr *ngFor="let product of orderedProducts">
        <td>{{product.ID}}</td>
        <td>{{product.Abbreviation}}</td>
        <td>{{product.Name}}</td>
        <td>{{product.Description | slice:0:25}}</td>
        <td>{{product.LastSettlementDate | date:'short' }}</td>
        <td>{{product.ModelType}}</td>
        <td>{{product.IsIndexed}}</td>
      </tr>
    </table>
  `
})

export class GetProductsComponent implements OnInit, OnDestroy
{  
    products: Product[];
    errorMessage: string;
    subscription: Subscription;

    _orderedProducts: Product[] = null;
    get orderedProducts(): Product[] 
    {
        if (this._orderedProducts == null)
            this._orderedProducts = this.orderByField<Product>(this.products, 'ID');

        return this._orderedProducts;
    }

    constructor(private dataStore: DataStore){
    }

    ngOnInit(): void {
        this.subscription = this.dataStore.Products.subscribe(products => this.products = products, error => {throw new Error(error);}, () => console.log("Loading products complete"));
    }

    ngOnDestroy(): void{
        if (this.subscription != null)
            this.subscription.unsubscribe();
    }

    //Ordering could be done in a pipe or by a service....see pipe documentation for concerns about pipes. Service is probably the way to go...
    private orderByField<T>(items: T[], field: string): T[]
    {
        if (items == null)
          return null;

        items.sort((a: any, b: any) => {
            if ( a[field] < b[field] ){ return -1; }
            else if( a[field] > b[field] ){ return 1; }
            else {return 0;}
        });

      return items;
    }
}

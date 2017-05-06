import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';

import 'rxjs/add/operator/switchMap';

import {Product} from "../../../../Entities/Product";
import {Expiration} from "../../../../Entities/Expiration";
import { ViewItem } from '../../../../Entities/ViewListItem';
import { ViewListService } from '../../../../Services/ViewList/view-list.service';

@Component({
    selector: 'qs-pricingsheet',
    template: `
      <div>
          <h1>PricingSheet Component</h1>
          <div *ngIf="ViewItem">
            ProductId: {{ViewItem.ViewContext.ProductID}}<br/>
            Symbol: {{ViewItem.ViewContext.Symbol}}<br/>
            {{ViewItem.Name}} content goes here...
          </div>
          <select>
            <option *ngFor="let product of Products">{{product.Name}}</option>
          </select>
       
      </div>
    `,
})

export class PricingSheetComponent implements OnInit{

    public ViewItem: ViewItem;
    public Products: Product[];

    private _expirations: Expiration[] = null;
    public get Expirations(): Expiration[]
    {
        // if (this._expirations == null)
        //     this.viewListService.getExpirations(this.ViewItem.ViewContext.ProductID).then(expirations => this._expirations = expirations);

        return this._expirations;
    }

    constructor
    (
        private viewListService: ViewListService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {

        this.route.params
            .switchMap((params: Params) => this.viewListService.getViewItem(+params['vid']))
            .subscribe(viewItem => this.ViewItem = viewItem);

        // this.viewListService.getProducts().then(products => this.Products = products);
    }

}

import { Injectable }   from '@angular/core';

import {QuikStrikeApp}  from "../../Entities/QuikStrikeApp";
import {Product}        from "../../Entities/Product";
import {Future}         from "../../Entities/Future";
import {Expiration}     from "../../Entities/Expiration";
import {Strike}         from "../../Entities/Strike";

import {ViewListItem,ViewItem,ViewGroup,ExpirationContext} from '../../Entities/ViewListItem';

@Injectable()
export class ViewListService {

    private _viewListItems: ViewListItem[] = null;
    private get ViewListItems(){

        if (this._viewListItems == null)
            this._viewListItems = this.LoadViewListItems();

        return this._viewListItems;
    }

    private _viewItems: ViewItem[] = null;
    private get ViewItems()
    {
        if (this._viewItems == null)
            this._viewItems = this.LoadViewItems();

        return this._viewItems;
    }

    getNewExpirationContext(): ExpirationContext{
        let ec = new ExpirationContext();
        // ec.Product = QuikStrikeApp.Current.Products[1];
        // ec.Expiration = ec.Product.Expirations[0];
        console.log('getNewExpirationContext:' + ec.Product.Name + '' + ec.Expiration.Symbol);
        return ec;
    }

    getQuikStrikeApp(): Promise<QuikStrikeApp>{
        return Promise.resolve(QuikStrikeApp.Current);
    }

    // getProducts(): Promise<Product[]>{
    //     return Promise.resolve(QuikStrikeApp.Current.Products);
    // }

    // getExpirations(productId:number): Promise<Expiration[]>{
    //     return Promise.resolve(this.getProducts().then(x => x.find(y => y.ID == productId).Expirations));
    // }

    getViews(): Promise<ViewListItem[]> {

        return Promise.resolve(this.ViewListItems);
    };	

    getViewItems(): Promise<ViewItem[]>{
        return Promise.resolve(this.ViewItems);
    }

    getViewItem(vid: number): Promise<ViewItem> {
        
        return this.getViewItems()
                .then(viewItems => viewItems.find(viewItem => viewItem.ID === vid));
    }

    private LoadViewItems(): ViewItem[]{

        let viewItems = new Array<ViewItem>();

        for (let vli of this.ViewListItems)
        {
            if (vli instanceof ViewItem)
                viewItems.push(vli as ViewItem);
            
            if (vli instanceof ViewGroup)
            {
                let viewGroup = vli as ViewGroup;
                for(let vli2 of viewGroup.ViewItems )
                    viewItems.push(vli2);
            }
        }

        return viewItems;
    }

    private LoadViewListItems(): ViewListItem[] {

        let items = new Array<ViewListItem>();

        let vli = new ViewItem();
        vli.ID = 1;
        vli.Name = "Calculator1";
        vli.Route = "calculator";
        vli.ViewContext = {ProductID:123, Symbol: "EDM7"};
        items.push(vli);

        vli = new ViewItem();
        vli.ID = 2;
        vli.Name = "TSM7 Sheet";
        vli.Route = "pricingsheet"
        vli.ViewContext = {ProductID:456, Symbol: "TSM7"};
        items.push(vli);

        vli = new ViewItem();
        vli.ID = 3;
        vli.Name = "XXXX Straddles";
        vli.Route = "straddlesheet"
        vli.ViewContext = {ProductID:999, Symbol: "XXXX"};
        items.push(vli);

        let vg = new ViewGroup();
        vg.ID = 4;
        vg.Name = "Eurodollars";
        vg.ViewItems = [
            {ID:5, Name:"Straddles", Route: "straddlesheet", ViewContext: {}},
            {ID:6, Name:"EDM7 - Prices", Route: "pricingsheet", ViewContext: {}},
            {ID:7, Name:"EDU7 - Prices", Route: "pricingsheet", ViewContext: {}},
        ];
        items.push(vg);

        vg = new ViewGroup();
        vg.ID = -4;
        vg.Name = "WTI Crude";
        vg.ViewItems = [
            {ID:8, Name:"Straddles", Route: "straddlesheet", ViewContext: {}},
            {ID:9, Name:"LOM7 - Prices", Route: "pricingsheet", ViewContext: {}},
            {ID:10, Name:"LOZ7 - Prices", Route: "pricingsheet", ViewContext: {}},
        ];
        items.push(vg);

        return items;

    }
}

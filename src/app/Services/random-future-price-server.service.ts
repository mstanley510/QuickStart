import { Injectable }   from '@angular/core';
import { Http, Response } from '@angular/http';


import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/publish';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/map';

import {Logger} from './logger.service';
import {Config} from './config.service';

import {FuturePriceServer} from './future-price-server';
import {StaticFuturePriceServer} from './static-future-price-server.service';
import {Product} from "../Entities/Product";
import {FuturePrice, IFuturePrice} from "../Entities/FuturePrice";

@Injectable()
export class RandomFuturePriceServer extends StaticFuturePriceServer {

    private items:Item[] = null;

    constructor(http: Http, config: Config, logger: Logger)
    {
        super(http, config, logger);
        this.items = new Array<Item>();
    }

    getFuturePrices(product: Product) : Observable<FuturePrice[]>{

        let item = this.items.find(x => x.productId == product.ID);
        if (item == null){
            item = this.addItem(product);
            this.items.push(item);
        }

        //return item.subject;
        return item.observable;
    }

    private addItem(product:Product):Item{
        let item = new Item();
        item.productId = product.ID;
        item.observable = Observable.combineLatest(
                super.getFuturePrices(product),
                Observable.interval(product.futureRefreshInterval).startWith(0),
                function(s1, s2){
                    console.log("Generating random price for product " + product.ID + "...");
                    s1.forEach((x:FuturePrice) => {
                        x.Open = x.Open * (1 + 0.005 * (Math.random() - 0.5));
                        x.High = x.High * (1 + 0.005 * (Math.random() - 0.5));
                        x.Low = x.Low * (1 + 0.005 * (Math.random() - 0.5));
                        x.Last = x.Last * (1 + 0.005 * (Math.random() - 0.5));
                    });
                    return s1;
                }
            ).publish().refCount();
        

        // let init = new Array<FuturePrice>();
        // init.push(new FuturePrice());
        // init.push(new FuturePrice());
        // init.push(new FuturePrice());
        // init.push(new FuturePrice());
        
        // item.subject = new BehaviorSubject(init);
        // item.observable.subscribe(item.subject);

        return item;
    }
}

class Item {
    productId:number;
    //subject:BehaviorSubject<FuturePrice[]>;
    observable:Observable<FuturePrice[]>;
}

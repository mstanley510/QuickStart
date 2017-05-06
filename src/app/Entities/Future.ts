
import { Observable } from 'rxjs/Observable';

import { Product } from './Product';
import { FuturePrice } from './FuturePrice'

export class Future 
{
    public Product: Product;
    public ID : number;
    public Symbol : string;
    public Description: string;
    public ExpirationDate : Date;

    public Prices : FuturePrice;

    public static fromIFuture(product:Product, ifu: IFuture): Future {
        let f = new Future();
        f.Product = product;
        f.ID = ifu.FutureId;
        f.Symbol = ifu.Name;
        f.Description = ifu.Description;
        f.ExpirationDate = new Date(parseInt(ifu.ExpirationDate.substr(6)));

        f.Prices = new FuturePrice();
        f.Prices.Last = ifu.FuturePrice;
        return f;
    }
}


export interface IFuture
{
    FutureId: number;
    Name: string;
    Description: string;
    ExpirationDate: string;
    FuturePrice: number;
}

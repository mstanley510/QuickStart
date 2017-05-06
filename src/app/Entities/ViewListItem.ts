
import { Product } from './Product';
import { Expiration } from './Expiration';

export interface ViewListItem {
    ID: number;
    Name: string;
}

export class ViewGroup implements ViewListItem  {
    ID: number;
    Name: string;
    ViewItems: ViewItem[];
}

export class ViewItem implements ViewListItem {
    ID: number;
    Name: string;
    Route: string;
    ViewContext: any;
}


export class ExpirationContext {
    Product: Product;
    Expiration: Expiration;
}
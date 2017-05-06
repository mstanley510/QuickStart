
import { Product } from "./Product";

export class QuikStrikeApp 
{
    private static _current : QuikStrikeApp = new QuikStrikeApp();

    public static get Current() : QuikStrikeApp
    {
        return QuikStrikeApp._current;  
    }

}

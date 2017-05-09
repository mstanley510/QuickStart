
export class FuturePrice
{
    public ID : number;
    public Symbol : string;
    public Open : number;
    public High : number;
    public Low : number;
    public Last : number;
    public Settle: number;

    public static fromIFP(ifp: IFuturePrice): FuturePrice {

        let fp = new FuturePrice();
        fp.ID = ifp.FutureId;
        fp.Symbol = ifp.Symbol;
        fp.Open = ifp.Open;
        fp.High = ifp.High;
        fp.Low = ifp.Low;
        fp.Last = ifp.Last;
        fp.Settle = ifp.Settle;
        return fp;
    }
}


export interface IFuturePrice
{
    FutureId: number;
    Symbol: string;
    Open: number;
    High: number;
    Low: number;
    Last: number;
    Settle: number;
}

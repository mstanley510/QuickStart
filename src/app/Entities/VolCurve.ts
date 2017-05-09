
import {Product} from "./Product";

export class Curves
{
    ExpirationId:number;
    Symbol:string;
    Strike:VolCurves;
    Moneyness:VolCurves;
    Delta:VolCurves;

    constructor(){
        this.Strike = new VolCurves();
        this.Moneyness = new VolCurves();
        this.Delta = new VolCurves();
    }

    public static fromICurves(product:Product, ic:ICurveItem):Curves{
        
        let c = new Curves();
        c.ExpirationId = ic.ExpirationId;
        c.Symbol = ic.Symbol;
        c.Strike = ic.Curves.Strike == null ? new VolCurves() : VolCurves.fromIVolCurves(ic.Curves.Strike);
        c.Moneyness = ic.Curves.Moneyness == null ? new VolCurves() : VolCurves.fromIVolCurves(ic.Curves.Moneyness);
        c.Delta = ic.Curves.Delta == null ? new VolCurves() : VolCurves.fromIVolCurves(ic.Curves.Delta);

        return c;
    }

      public static fromICurves2(ic:ICurveItem):Curves{
        
        let c = new Curves();
        c.ExpirationId = ic.ExpirationId;
        c.Symbol = ic.Symbol;
        c.Strike = ic.Curves.Strike == null ? new VolCurves() : VolCurves.fromIVolCurves(ic.Curves.Strike);
        c.Moneyness = ic.Curves.Moneyness == null ? new VolCurves() : VolCurves.fromIVolCurves(ic.Curves.Moneyness);
        c.Delta = ic.Curves.Delta == null ? new VolCurves() : VolCurves.fromIVolCurves(ic.Curves.Delta);

        return c;
    }
}

export class VolCurves
{
    Settle:VolCurve;
    Current:VolCurve;


    public static fromIVolCurves(ivc:IVolCurves): VolCurves{

        let vc = new VolCurves();
        vc.Settle = ivc.Settle == null ? null : VolCurve.fromIVolCurve(ivc.Settle);
        vc.Current = ivc.Current == null ? null : VolCurve.fromIVolCurve(ivc.Current);
        return vc;
    }
}

export class VolCurve
{
    Coefficients:number[];
    High:number;
    Low:number;
    DTE:number;
    Future:number;
    IsInterpolated:boolean;

    F(x:number):number{

        x = Math.min(x, this.High);
        x = Math.max(x, this.Low);

        let total = 0;
        let x_factor = 1;
        for (let i = 0; i < this.Coefficients.length; i++){
            total += x_factor * this.Coefficients[i];
            x_factor *= x;
        }
        return total;
    }

    static fromIVolCurve(ivc: IVolCurve): VolCurve {

        let vc = new VolCurve();
        vc.Coefficients = ivc.Coefficients;
        vc.High = ivc.High;
        vc.Low = ivc.Low;
        vc.DTE = ivc.DTE;
        vc.Future = ivc.Future;
        vc.IsInterpolated = ivc.IsInterpolated;
        return vc;
    }
}

export interface ICurveItem
{
    ExpirationId:number;
    Symbol:string;
    Curves:ICurves;
}
export interface ICurves
{
    Strike:IVolCurves;
    Moneyness:IVolCurves;
    Delta:IVolCurves;
}

export interface IVolCurves
{
    Settle:IVolCurve;
    Current:IVolCurve;
}

export interface IVolCurve
{
    Coefficients:number[];
    High:number;
    Low:number;
    DTE:number;
    Future:number;
    IsInterpolated:boolean;
}

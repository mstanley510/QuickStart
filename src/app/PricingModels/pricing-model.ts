
export enum OptionType {
    Call = 1,
    Put = 2,
    Straddle =3
}

export enum ModelType
{
    Black76 = 1,
    BSAmerican2002 = 12,
    Bachelier = 13
}

export class ModelParameters
{
    modelType:ModelType;
    indexedProduct:boolean;
}

export class Results
{
    Premium: number;
    Delta: number;
    Gamma: number;
    Vega: number;
    Theta: number;
    Rho: number;
    DdeltaDvol: number;
    DdeltaDstrike: number;
}

export abstract class PricingModel
{
    INCREMENT_PRICE: number = 0.001;
    INCREMENT_VOL: number = 0.01;
    INCREMENT_TIME: number = 1;
    INCREMENT_RATE: number = 0.01;
    INCREMENT_STRIKE: number = 0.01;

    public abstract Call(price:number, strike:number, days:number, rate:number, vol:number, calcGreeks:boolean):Results;
    public abstract Put(price:number, strike:number, days:number, rate:number, vol:number, calcGreeks:boolean):Results;

    constructor(protected modelParameters:ModelParameters){
        this.modelParameters = modelParameters;
    }

    ND(x:number):number{
        let temp1 = Math.sqrt(2 * Math.PI);
        let temp2 = Math.exp((-1 * Math.pow(x, 2)) / 2);
        return 1 / temp1 * temp2;
    }

    CND(x:number):number {
        let cnd = 0;
        let sumA = 0;
        let sumB = 0;
        let y = Math.abs(x);

        if (y > 37) {
            cnd = 0;
        }
        else {
            let Exponential = Math.exp(-(y * y) / 2);
            if (y < 7.07106781186547) {
                sumA = 3.52624965998911E-02 * y + 0.700383064443688;
                sumA = sumA * y + 6.37396220353165;
                sumA = sumA * y + 33.912866078383;
                sumA = sumA * y + 112.079291497871;
                sumA = sumA * y + 221.213596169931;
                sumA = sumA * y + 220.206867912376;

                sumB = 8.83883476483184E-02 * y + 1.75566716318264;
                sumB = sumB * y + 16.064177579207;
                sumB = sumB * y + 86.7807322029461;
                sumB = sumB * y + 296.564248779674;
                sumB = sumB * y + 637.333633378831;
                sumB = sumB * y + 793.826512519948;
                sumB = sumB * y + 440.413735824752;
                cnd = Exponential * sumA / sumB;
            }
            else {
                sumA = y + 0.65;
                sumA = y + 4 / sumA;
                sumA = y + 3 / sumA;
                sumA = y + 2 / sumA;
                sumA = y + 1 / sumA;
                cnd = Exponential / (sumA * 2.506628274631);
            }
        }

        if (x > 0)
            cnd = 1 - cnd;

        return cnd;
    }

    phi(S:number, T:number, gamma:number, H:number, I:number, r:number, b:number, v:number): number
    {
        let lambda = (-r + gamma * b + 0.5 * gamma * (gamma - 1) * Math.pow(v, 2)) * T;
        let d = -(Math.log(S / H) + (b + (gamma - 0.5) * Math.pow(v, 2)) * T) / (v * Math.sqrt(T));
        let kappa = 2 * b / Math.pow(v, 2) + (2 * gamma - 1);
        let toReturn = Math.exp(lambda) * Math.pow(S, gamma) * (this.CND(d) - Math.pow((I / S), kappa) * this.CND(d - 2 * Math.log(I / S) / (v * Math.sqrt(T))));
        return toReturn;
    }

    ksi(S:number, T2:number, gamma:number, h:number, I2:number, I1:number, t1:number, r:number, b:number, v:number)
    {
        let e1 = (Math.log(S / I1) + (b + (gamma - 0.5) * (v * v)) * t1) / (v * Math.sqrt(t1));
        let e2 = (Math.log((I2 * I2) / (S * I1)) + (b + (gamma - 0.5) * (v * v)) * t1) / (v * Math.sqrt(t1));
        let e3 = (Math.log(S / I1) - (b + (gamma - 0.5) * (v * v)) * t1) / (v * Math.sqrt(t1));
        let e4 = (Math.log((I2 * I2) / (S * I1)) - (b + (gamma - 0.5) * (v * v)) * t1) / (v * Math.sqrt(t1));

        let f1 = (Math.log(S / h) + (b + (gamma - 0.5) * (v * v)) * T2) / (v * Math.sqrt(T2));
        let f2 = (Math.log((I2 * I2) / (S * h)) + (b + (gamma - 0.5) * (v * v)) * T2) / (v * Math.sqrt(T2));
        let f3 = (Math.log((I1 * I1) / (S * h)) + (b + (gamma - 0.5) * (v * v)) * T2) / (v * Math.sqrt(T2));
        let f4 = (Math.log(S * (I1 * I1) / (h * (I2 * I2))) + (b + (gamma - 0.5) * (v * v)) * T2) / (v * Math.sqrt(T2));

        let rho = Math.sqrt(t1 / T2);
        let lambda = -r + gamma * b + 0.5 * gamma * (gamma - 1) * (v * v);
        let kappa = 2 * b / (v * v) + (2 * gamma - 1);

        let toReturn = Math.exp(lambda * T2) * Math.pow(S, gamma) * (this.CBND(-e1, -f1, rho) - Math.pow((I2 / S), kappa) * this.CBND(-e2, -f2, rho)
        - Math.pow((I1 / S), kappa) * this.CBND(-e3, -f3, -rho) + Math.pow((I1 / I2), kappa) * this.CBND(-e4, -f4, -rho));

        return toReturn;
    }

    CBND(X:number, y:number, rho:number)
    {
        let i;
        let ISs;
        let LG;
        let NG;
        //double[,] XX = new double[11, 4];
        //double[,] W = new double[11, 4];

        let XX:number[][] = [[11],[4]];
        for(let j=0; j<11; j++) XX[j] = [];

        let W:number[][] = [[11],[4]];
        for(let j=0; j<11; j++) W[j] = [];
        let h;
        let k;
        let hk;
        let hs;
        let BVN;
        let Ass;
        let asr;
        let sn;
        let A;
        let b;
        let bs;
        let c;
        let d;
        let xs;
        let rs;

        W[1][1] = 0.17132449237917;
        XX[1][1] = -0.932469514203152;
        W[2][1] = 0.360761573048138;
        XX[2][1] = -0.661209386466265;
        W[3][1] = 0.46791393457269;
        XX[3][1] = -0.238619186083197;

        W[1][2] = 4.71753363865118E-02;
        XX[1][2] = -0.981560634246719;
        W[2][2] = 0.106939325995318;
        XX[2][2] = -0.904117256370475;
        W[3][2] = 0.160078328543346;
        XX[3][2] = -0.769902674194305;
        W[4][2] = 0.203167426723066;
        XX[4][2] = -0.587317954286617;
        W[5][2] = 0.233492536538355;
        XX[5][2] = -0.36783149899818;
        W[6][2] = 0.249147045813403;
        XX[6][2] = -0.125233408511469;

        W[1][3] = 1.76140071391521E-02;
        XX[1][3] = -0.993128599185095;
        W[2][3] = 4.06014298003869E-02;
        XX[2][3] = -0.963971927277914;
        W[3][3] = 6.26720483341091E-02;
        XX[3][3] = -0.912234428251326;
        W[4][3] = 8.32767415767048E-02;
        XX[4][3] = -0.839116971822219;
        W[5][3] = 0.10193011981724;
        XX[5][3] = -0.746331906460151;
        W[6][3] = 0.118194531961518;
        XX[6][3] = -0.636053680726515;
        W[7][3] = 0.131688638449177;
        XX[7][3] = -0.510867001950827;
        W[8][3] = 0.142096109318382;
        XX[8][3] = -0.37370608871542;
        W[9][3] = 0.149172986472604;
        XX[9][3] = -0.227785851141645;
        W[10][3] = 0.152753387130726;
        XX[10][3] = -7.65265211334973E-02;

        if (Math.abs(rho) < 0.3)
        {
            NG = 1;
            LG = 3;
        }
        else if (Math.abs(rho) < 0.75)
        {
            NG = 2;
            LG = 6;
        }
        else
        {
            NG = 3;
            LG = 10;
        }

        h = -X;
        k = -y;
        hk = h * k;
        BVN = 0;

        if (Math.abs(rho) < 0.925)
        {
            if (Math.abs(rho) > 0)
            {
                hs = (h * h + k * k) / 2;
                asr = Math.asin(rho);
                for (i = 1; i <= LG; i++)
                {
                    for (ISs = -1; ISs <= 1; ISs += 2)
                    {
                        sn = Math.sin(asr * (ISs * XX[i][NG] + 1) / 2);
                        BVN = BVN + W[i][NG] * Math.exp((sn * hk - hs) / (1 - sn * sn));
                    }
                }
                BVN = BVN * asr / (4 * Math.PI);
            }
            BVN = BVN + this.CND(-h) * this.CND(-k);
        }
        else
        {
            if (rho < 0)
            {
                k = -k;
                hk = -hk;
            }
            if (Math.abs(rho) < 1)
            {
                Ass = (1 - rho) * (1 + rho);
                A = Math.sqrt(Ass);
                bs = Math.pow((h - k), 2);
                c = (4 - hk) / 8;
                d = (12 - hk) / 16;
                asr = -(bs / Ass + hk) / 2;
                if (asr > -100)
                {
                    BVN = A * Math.exp(asr) * (1 - c * (bs - Ass) * (1 - d * bs / 5) / 3 + c * d * Ass * Ass / 5);
                }
                if (-hk < 100)
                {
                    b = Math.sqrt(bs);
                    BVN = BVN - Math.exp(-hk / 2) * Math.sqrt(2 * Math.PI) * this.CND(-b / A) * b * (1 - c * bs * (1 - d * bs / 5) / 3);
                }
                A = A / 2;
                for (i = 1; i <= LG; i++)
                {
                    for (ISs = -1; ISs <= 1; ISs += 2)
                    {
                        xs = Math.pow((A * (ISs * XX[i][NG] + 1)), 2);
                        rs = Math.sqrt(1 - xs);
                        asr = -(bs / xs + hk) / 2;
                        if (asr > -100)
                        {
                            BVN = BVN + A * W[i][NG] * Math.exp(asr) * (Math.exp(-hk * (1 - rs) / (2 * (1 + rs))) / rs - (1 + c * xs * (1 + d * xs)));
                        }
                    }
                }
                BVN = -BVN / (2 * Math.PI);
            }
            if (rho > 0)
            {
                BVN = BVN + this.CND(-Math.max(h, k));
            }
            else
            {
                BVN = -BVN;
                if (k > h)
                {
                    BVN = BVN + this.CND(k) - this.CND(h);
                }
            }
        }

        return BVN;
    }

    GetDelta(optionType:OptionType, price:number, strike:number, rate:number, days:number, vol:number):number
    {
        let inc:Results;
        let dec:Results;
        let dIncPrice = this.INCREMENT_PRICE;

        switch (optionType)
        {
            case OptionType.Call:
                inc = this.Call(price + dIncPrice, strike, rate, days, vol, false);
                dec = this.Call(price - dIncPrice, strike, rate, days, vol, false);
                break;

            case OptionType.Put:
                inc = this.Put(price + dIncPrice, strike, rate, days, vol, false);
                dec = this.Put(price - dIncPrice, strike, rate, days, vol, false);
                break;

            default:
                throw "GetDelta only works for Call and Put types";
        }

        return (inc.Premium - dec.Premium) / (2 * dIncPrice);
    }

    GetGamma(optionType:OptionType, price:number, strike:number, rate:number, days:number, vol:number):number
    {
        let inc:Results;
        let dec:Results;
        let center:Results;
        let dIncPrice = this.INCREMENT_PRICE;

        switch (optionType)
        {
            case OptionType.Call:
                inc = this.Call(price + dIncPrice, strike, rate, days, vol, false);
                dec = this.Call(price - dIncPrice, strike, rate, days, vol, false);
                center = this.Call(price, strike, rate, days, vol, false);
                break;
            case OptionType.Put:
                inc = this.Put(price + dIncPrice, strike, rate, days, vol, false);
                dec = this.Put(price - dIncPrice, strike, rate, days, vol, false);
                center = this.Put(price, strike, rate, days, vol, false);
                break;
            default:
                throw "GetGamma only works for Call and Put types";
        }

        //Gamma = (V(S + DS) - 2 * V(S) + V(S - DS)) / (DS ^ 2);
        return (inc.Premium + dec.Premium - center.Premium * 2) / (dIncPrice * dIncPrice);
    }

    GetVega(optionType:OptionType, price:number, strike:number, rate:number, days:number, vol:number):number
    {
        let inc:Results;
        let dec:Results;
        var dIncVol = this.INCREMENT_VOL;

        switch (optionType)
        {
            case OptionType.Call:
                inc = this.Call(price, strike, rate, days, vol + dIncVol, false);
                dec = this.Call(price, strike, rate, days, vol - dIncVol, false);
                break;
            case OptionType.Put:
                inc = this.Put(price, strike, rate, days, vol + dIncVol, false);
                dec = this.Put(price, strike, rate, days, vol - dIncVol, false);
                break;
            default:
                throw "GetVega only works for Call and Put types";
        }

        return (inc.Premium - dec.Premium) / 2;   //(dIncVol * 2) / 100;
    }

    GetTheta(optionType:OptionType, price:number, strike:number, rate:number, days:number, vol:number):number
    {
        let current:Results;
        let dec:Results;
        let dIncTime = this.INCREMENT_TIME;
        let dDayMinus:number;

        dDayMinus = days - dIncTime;
        if (dDayMinus <= 0)
            dDayMinus = 0.00365;

        switch (optionType)
        {
            case OptionType.Call:
                current = this.Call(price, strike, rate, days, vol, false);
                dec = this.Call(price, strike, rate, dDayMinus, vol, false);
                break;
            case OptionType.Put:
                current = this.Put(price, strike, rate, days, vol, false);
                dec = this.Put(price, strike, rate, dDayMinus, vol, false);
                break;
            default:
                throw "GetTheta only works for Call and Put types";
        }

        return (dec.Premium - current.Premium);
    }

}
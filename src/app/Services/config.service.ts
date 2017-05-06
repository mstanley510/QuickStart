import { Injectable }   from '@angular/core';

@Injectable()
export class Config {

    public dataUrl: string = 'http://localhost/QuikStrike.DataServices/QuikData/JSON.svc/';
}

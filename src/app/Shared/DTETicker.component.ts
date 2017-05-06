import { Component, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import {Future} from '../Entities/Future';

@Component({
    selector: 'qs-dteticker',
    template: `{{this.DTE | async | number:'1.4-4'}}`
})

export class DTETickerComponent implements OnDestroy {
    
    @Input() date: Date;
    @Input() interval: number = 86400; //3000;

    private timer: NodeJS.Timer;
    private _DTEObservable: Observable<number> = null;
    public get DTE(): Observable<number>
    {
        if (this._DTEObservable == null)
            this._DTEObservable = new Observable<number>((observer: Observer<number>) => {

                observer.next((this.date.getTime() - new Date().getTime()) / 86400000);

                this.timer = setInterval(() => {
                    let dte = (this.date.getTime() - new Date().getTime()) / 86400000;
                    observer.next(dte);
                }, this.interval);
            });

        return this._DTEObservable;
    }

    ngOnDestroy(){
        clearInterval(this.timer);
    }
}
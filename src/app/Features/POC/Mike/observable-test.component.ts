import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/count';

import { DataService } from '../../../Services/data-service.service';

import {Future}        from "../../../Entities/Future";
import {FuturePrice}        from "../../../Entities/FuturePrice";
import {IFuturePrice}        from "../../../Entities/FuturePrice";

@Component({
    template: `
    <h1>Observable Test</h1>
    <div><button (click)="onMapClick()">map</button>{{mapOutput}}</div>
    <div><button (click)="onMap2Click()">2X map</button>{{map2Output}}</div>
    <div><button (click)="onCountClick()">count</button>{{countOutput}}</div>
    <div><button (click)="onIntervalClick()">interval</button>{{intervalOutput}}</div>
    <div><button (click)="onConcatClick()">Concat</button>{{concatOutput}}</div>
    <div><button (click)="onTestClick()">Test</button><button (click)="onStopTestClick()">StopTest</button></div>
    <table>
        <tr>
            <th>ID</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Last</th>
        </tr>
        <tr *ngFor="let f of futures">
            <td>{{f.ID}}</td>
            <td>{{f.Prices.Open | number:'1.4-4'}}</td>
            <td>{{f.Prices.High | number:'1.4-4'}}</td>
            <td>{{f.Prices.Low | number:'1.4-4'}}</td>
            <td>{{f.Prices.Last | number:'1.4-4'}}</td>
        </tr>
    </table>

    `
})

export class ObservableTestComponent implements OnInit, OnDestroy {

    inputs: number[] = [1, 2, 3, 4, 5, 6];
    mapOutput: string = '';
    map2Output: string = '';
    countOutput: string = '';
    intervalOutput: string = '';
    concatOutput:string = '';
    futures: Future[];

    testSubscription: Subscription;

    constructor(private http: Http, private dataService: DataService)
    {}

    ngOnInit() { }

    ngOnDestroy(){
        if (this.testSubscription != null)
            this.testSubscription.unsubscribe();
    }


    onTestClick():void{
        //this.testSubscription = this.dataService.getFutures(2, 3000).subscribe(x => this.futures = x);
    }

    onStopTestClick():void{
        //this.testSubscription.unsubscribe();
    }

    onConcatClick():void{
        let o1 = Observable.of('A', 'B');
        let o2 = Observable.range(1, 5);
        let o3 = o1.takeWhile(x=>true).concat(o2).filter(x => typeof(x) == typeof(''));

        o3.subscribe(x => this.concatOutput += typeof(x) + ',');
        
    }

    onIntervalClick():void{
        let source1 = Observable.range(1, 2);
        let source2 = Observable.interval(1000).take(15);
        let subscription = Observable.merge(source1, source2).subscribe(x => this.intervalOutput += x + ',');
        //subscription.unsubscribe();
    }
    onMapClick():void{
        let source = this.getObservable().map(x => x);
        let subscription = source.subscribe(x => this.mapOutput += x + ',');
        subscription.unsubscribe();
    }

    onMap2Click():void{
        let source = this.getObservable().map(x=>2*x);
        let subscription = source.subscribe(x => this.map2Output += x + ',');
        subscription.unsubscribe();
    }

    onCountClick():void{
        let source = this.getObservable().count();
        let subscription = source.subscribe(x => this.countOutput += x + ',');
        subscription.unsubscribe();
    }

    getObservable(): Observable<number>{
        return new Observable<number>((observer: Observer<number>) => {
            for(let x of this.inputs)
                observer.next(x);
            observer.complete();
        });
    }
}


import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/publish';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/count';

import { DataService } from '../../../Services/data-service.service';
import { DataStore } from '../../../Services/data-store.service';

import {Product}        from "../../../Entities/Product";
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
    <div><button (click)="onConnect1Click()">Connect1</button><button (click)="onDisconnect1Click()">Disconnect1</button></div>
    <div><button (click)="onConnect2Click()">Connect2</button><button (click)="onDisconnect2Click()">Disconnect2</button></div>
    <div><button (click)="onConnect3Click()">Connect3</button><button (click)="onDisconnect3Click()">Disconnect3</button></div>
    <div><button (click)="onConnect4Click()">Connect4</button><button (click)="onDisconnect4Click()">Disconnect4</button></div>
    <div><button (click)="onTestClick()">Test</button><button (click)="onStopTestClick()">StopTest</button></div>
    <div><h2>Product1</h2></div>
    <div style='float:left'>
        <table *ngIf="prices1">
            <tr>
                <th>Open</th>
                <th>High</th>
                <th>Low</th>
                <th>Last</th>
            </tr>
            <tr>
                <td>{{prices1[0].Open | number:'1.4-4'}}</td>
                <td>{{prices1[0].High | number:'1.4-4'}}</td>
                <td>{{prices1[0].Low | number:'1.4-4'}}</td>
                <td>{{prices1[0].Last | number:'1.4-4'}}</td>
            </tr>
        </table>
        </div>
        <div style='float:right'>
        <table *ngIf="prices2">
            <tr>
                <th>Open</th>
                <th>High</th>
                <th>Low</th>
                <th>Last</th>
            </tr>
            <tr>
                <td>{{prices2[0].Open | number:'1.4-4'}}</td>
                <td>{{prices2[0].High | number:'1.4-4'}}</td>
                <td>{{prices2[0].Low | number:'1.4-4'}}</td>
                <td>{{prices2[0].Last | number:'1.4-4'}}</td>
            </tr>
        </table>
    </div>
    <div style='clear:both'></div>
    <div><h2>Product2</h2></div>
    <div style='float:left'>
        <table *ngIf="prices3">
            <tr>
                <th>Open</th>
                <th>High</th>
                <th>Low</th>
                <th>Last</th>
            </tr>
            <tr>
                <td>{{prices3[0].Open | number:'1.4-4'}}</td>
                <td>{{prices3[0].High | number:'1.4-4'}}</td>
                <td>{{prices3[0].Low | number:'1.4-4'}}</td>
                <td>{{prices3[0].Last | number:'1.4-4'}}</td>
            </tr>
        </table>
        </div>
        <div style='float:right'>
        <table *ngIf="prices4">
            <tr>
                <th>Open</th>
                <th>High</th>
                <th>Low</th>
                <th>Last</th>
            </tr>
            <tr>
                <td>{{prices4[0].Open | number:'1.4-4'}}</td>
                <td>{{prices4[0].High | number:'1.4-4'}}</td>
                <td>{{prices4[0].Low | number:'1.4-4'}}</td>
                <td>{{prices4[0].Last | number:'1.4-4'}}</td>
            </tr>
        </table>
    </div>
    <div style='clear:both'></div>
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

    prices1: FuturePrice[];
    prices2: FuturePrice[];
    prices3: FuturePrice[];
    prices4: FuturePrice[];

    testSubscription: Subscription;
    connect1Subscription: Subscription;
    connect2Subscription: Subscription;
    connect3Subscription: Subscription;
    connect4Subscription: Subscription;

    constructor(private http: Http, private dataStore: DataStore, private dataService: DataService)
    {}

    ngOnInit() { }

    ngOnDestroy(){
        if (this.testSubscription != null)
            this.testSubscription.unsubscribe();
    }


    onTestClick():void{
    }

    onStopTestClick():void{
        //this.testSubscription.unsubscribe();
    }

    onConnect1Click():void{

        this.dataStore.Products.subscribe((products) => {

            this.connect1Subscription = this.dataService.getFuturePrices(products[0]).subscribe(prices => {
                    this.prices1 = prices;
            });
        });
    }

    onConnect2Click():void{
        this.dataStore.Products.subscribe((products) => {

            this.connect2Subscription = this.dataService.getFuturePrices(products[0]).subscribe(prices => {
                    this.prices2 = prices;
            });
        });

    }

    onConnect3Click():void{
        this.dataStore.Products.subscribe((products) => {

            this.connect3Subscription = this.dataService.getFuturePrices(products[1]).subscribe(prices => {
                    this.prices3 = prices;
            });
        });

    }

    onConnect4Click():void{
        this.dataStore.Products.subscribe((products) => {

            this.connect4Subscription = this.dataService.getFuturePrices(products[1]).subscribe(prices => {
                    this.prices4 = prices;
            });
        });

    }



    onDisconnect1Click():void{
        console.log('unsubscribe1...');
        if (this.connect1Subscription != null)
            this.connect1Subscription.unsubscribe();
    }

    onDisconnect2Click():void{
        console.log('unsubscribe2...');
        if (this.connect2Subscription != null)
            this.connect2Subscription.unsubscribe();
    }

    onDisconnect3Click():void{
        console.log('unsubscribe3...');
        if (this.connect3Subscription != null)
            this.connect3Subscription.unsubscribe();
    }

    onDisconnect4Click():void{
        console.log('unsubscribe4...');
        if (this.connect4Subscription != null)
            this.connect4Subscription.unsubscribe();
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


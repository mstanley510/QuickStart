import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'number-ticker',
    template: `
        <button (click)="decrement()">-</button>
        <input style="width:5em" [value]="value | number:format" (input)="onChange($event.target.value)" />
        <button (click)="increment()">+</button>
    `
})

export class NumberTickerComponent {
    
    @Input() value:number;
    @Input() step:number;
    @Input() format:string;

    @Output() valueChange = new EventEmitter<number>();

    decrement():void{
        this.change(-this.step);
    }

    increment():void{
        this.change(+this.step);
    }

    onChange(value:number):void{
        this.value = +value;
        this.valueChange.emit(this.value);
        console.log(this.value);
    }

    change(amount:number):void{
        this.value += amount;
        this.valueChange.emit(this.value);
    }
}
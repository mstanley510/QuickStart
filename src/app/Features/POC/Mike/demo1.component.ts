import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  template: `
    <h1>Demo1</h1>
    <div>
        <label>BoxWidth:</label><input type='text' [(ngModel)]="boxWidth" />
        <label>BoxHeight:</label><input type='text' [(ngModel)]="boxHeight" />
        <button #trigger (click)='setStyles()'>Set Styles</button>
        {{el.nativeElement.offsetLeft}},{{el.nativeElement.offsetTop}}
    </div>
    <div [style.background-color]="backgroundColor" [style.width.px]="boxWidth" [style.height.px]="boxHeight"></div>
    <div [ngStyle]="currentStyles">Foo</div>
  `
})

export class Demo1Component
{  
    boxWidth: number;
    boxHeight: number;
    backgroundColor: string;

    currentStyles: {};

    constructor(private el: ElementRef){
        this.boxWidth = 200;
        this.boxHeight = 200;
        this.backgroundColor = "blue";

        this.currentStyles = {
            'width': '200px',
            'height': '200px',
            'background-color': "red"
        };
    }

    setStyles(): void {

        
        this.currentStyles = {
            'width': '300px',
            'height': '200px',
            'background-color': 'green',
            'position': 'absolute',
            'top': '200px',
            'left': '200px'
        };
    }
}

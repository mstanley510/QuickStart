import { Component, OnInit } from '@angular/core';
import { Product } from "../../../Entities/Product";

@Component({
  template: `
    <h1>Static Sheet</h1>
    <product-picker #ppicker></product-picker>
    <expiration-picker [product]="ppicker.selectedProduct"></expiration-picker>
  `
})

export class SheetComponent implements OnInit  
{  
    ngOnInit(): void {
    }
}

import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DTETickerComponent } from "./DTETicker.component";
import { ProductPickerComponent } from './product-picker.component';
import { ExpirationPickerComponent } from './expiration-picker.component';
import { NumberTickerComponent } from './number-ticker.component';

@NgModule({
  imports: 
  [ 
    CommonModule, 
    FormsModule 
  ],
  exports: 
  [ 
    DTETickerComponent, 
    ProductPickerComponent, 
    ExpirationPickerComponent,
    NumberTickerComponent 
  ],
  declarations: 
  [ 
      DTETickerComponent,
      ProductPickerComponent,
      ExpirationPickerComponent,
      NumberTickerComponent
  ],
})

export class SharedModule {}

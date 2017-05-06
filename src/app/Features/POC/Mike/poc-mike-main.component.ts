import { Component } from '@angular/core';

@Component({
  template: `
    <h1>Welcome to Mikes's POC section</h1>
    <button routerLink='get-products'>GetProducts</button>
    <button routerLink='get-futures'>GetFutures</button>
    <button routerLink='get-expirations'>GetExpirations</button>
    <button routerLink='get-strikes'>GetStrikes</button>
    <button routerLink='calculator'>Calculator</button>
    <button routerLink='sheet'>Sheet</button>
    <button routerLink='demo1'>Demo1</button>
    <button routerLink='observable-test'>Observables</button>
  `
})

export class POCMikeMainComponent  
{  

}

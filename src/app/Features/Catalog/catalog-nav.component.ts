import { Component } from '@angular/core';

@Component({
    selector: 'catalog-nav',
    template: `
        <div>

            <button class="" type="button" routerLink="welcome">Welcome</button>
            <button class="" type="button" routerLink="calculator">Calculator</button>

            <div ngbDropdown class="d-inline-block">
                <button class="" ngbDropdownToggle>Sheets</button>
                <div class="dropdown-menu">
                <button class="dropdown-item">Prices</button>
                <button class="dropdown-item">Straddles</button>
                <button class="dropdown-item">More...</button>
                </div>
            </div>

            <div ngbDropdown class="d-inline-block">
                <button class="" ngbDropdownToggle>Charts</button>
                <div class="dropdown-menu">
                <button class="dropdown-item">Future History</button>
                <button class="dropdown-item">Volatility</button>
                <button class="dropdown-item">More...</button>
                </div>
            </div>

        </div>
    `
})

export class CatalogNavComponent  
{  

}
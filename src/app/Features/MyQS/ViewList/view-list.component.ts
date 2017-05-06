import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { ViewItem } from '../../../Entities/ViewListItem';
import { ViewListItem } from '../../../Entities/ViewListItem';
import { ViewListService } from '../../../Services/ViewList/view-list.service';

@Component({
	selector: 'view-list',
    templateUrl: './view-list.component.html'
})

export class ViewListComponent  {

    private _items: ViewListItem[] = null;
    public get Items(){

        if (this._items == null)
            this.viewListService.getViews().then(items => this._items = items);

        return this._items;
    }

    constructor(
        private viewListService: ViewListService,
        private location: Location
        ){ }

    itemClick(viewItem: ViewItem): void {
    }
}


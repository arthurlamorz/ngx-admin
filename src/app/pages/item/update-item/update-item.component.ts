import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToasterService, Toast, ToasterConfig, BodyOutputType } from 'angular2-toaster';
import { ItemService, ItemList, Item } from '../../../services/cms-services/item.service'

import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-update-item',
  templateUrl: './update-item.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }

    :host ::ng-deep td {
      word-break: break-all;
      height: 75px;
    }

    :host ::ng-deep textarea {
      word-break: break-all;
      height: 200px;
    }
  `],
})
export class UpdateItemComponent implements OnInit, OnDestroy {

  public appId;
  public modelName;
  public itemKey;
  public item: Item = new Item();

  public toasterConfig: ToasterConfig;
  constructor(
    private itemService: ItemService,
    private toasterService: ToasterService,
  ) {
   
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
  }

  onSubmit() {
    const self = this;
    self.itemService
      .updateItem(self.appId, self.modelName, self.itemKey, self.item)
      .subscribe(result => {
            const toast: Toast = {
              type: 'success',
              title: 'Success',
              body: self.itemKey + ' Successfully created/Updated',
              timeout: 0,
              showCloseButton: true,
              bodyOutputType: BodyOutputType.TrustedHtml,
            };
            this.toasterService.popAsync(toast);
          }, error => {
            const toast: Toast = {
              type: 'error',
              title: 'Oops! Error',
              body: 'Failed to create ' + self.itemKey  + ': ' + JSON.stringify(JSON.parse(error).error),
              timeout: 0,
              showCloseButton: true,
              bodyOutputType: BodyOutputType.TrustedHtml,
            };
            this.toasterService.popAsync(toast);
    
          });
    
  }

  
}

import { Component, Input, OnInit } from '@angular/core';
import { ToasterService, Toast, ToasterConfig, BodyOutputType } from 'angular2-toaster';
import { AppListService, AppDetail } from '../../../services/cms-services/list-app.service';

import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-app-card',
  styleUrls: ['./app-card.component.scss'],
  templateUrl: './app-card.component.html',
  // template: `
  // <div *ngFor="let item of appList?.appList; odd as isOdd">
  // <div class="col-xxxl-3 col-md-6">
  //   <nb-card>
  //     <div class="icon-container">
  //       <div class="icon {{ isOdd? 'success' : 'warning' }}">
  //         <ng-content></ng-content>
  //       </div>
  //     </div>

  //     <div class="details">
  //       <div class="title">{{ item.appName }}</div>
  //       <div class="status">ON</div>
  //     </div>
  //   </nb-card>
  //   </div>
  // </div>
  // `,
})
export class AppCardComponent implements OnInit {

  @Input() title: string;
  @Input() status: string;
  @Input() description: string;
  @Input() on = true;

  appDetails: AppDetail[];
  toasterConfig: ToasterConfig;

  constructor(
    private appListService: AppListService,
    private toasterService: ToasterService,
  ) {


  }

  ngOnInit() {
    const self = this;
    self.appListService.listApp()
      .subscribe(al => {
        if (al)
          self.appDetails = al.appList;
      }, error => {
        self.toasterConfig = new ToasterConfig({
          positionClass: 'toast-top-full-width',
          timeout: 0,
          newestOnTop: true,
          tapToDismiss: true,
          preventDuplicates: true,
          animation: 'fade',
          limit: 5,
        });

        const toast: Toast = {
          type: 'error',
          title: 'Oops! Error',
          body: 'App cards failed: ' + error.message,
          timeout: 0,
          showCloseButton: true,
          bodyOutputType: BodyOutputType.TrustedHtml,
        };
        this.toasterService.popAsync(toast);
      });


  }
}

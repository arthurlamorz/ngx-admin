import { Component, OnInit, OnDestroy } from '@angular/core';

import { ToasterService, Toast, ToasterConfig, BodyOutputType } from 'angular2-toaster';

import { AppListService, AppData, AppDetails } from '../../../services/cms-services/app-list.service';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-create-app',
  templateUrl: './create-app.component.html',
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
export class CreateAppComponent implements OnInit, OnDestroy {

  public appId;
  public model: AppData = new AppData();


  public toasterConfig: ToasterConfig;
  constructor(
    private appListService: AppListService,
    private toasterService: ToasterService,
  ) {
    this.model.details = new AppDetails();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
  }

  onSubmit() {
    const self = this;
    self.appListService
      .createApp(self.model)
      .subscribe(result => {
        const toast: Toast = {
          type: 'success',
          title: 'Success',
          body: self.model.appId + ' Successfully created',
          timeout: 0,
          showCloseButton: true,
          bodyOutputType: BodyOutputType.TrustedHtml,
        };
        this.toasterService.popAsync(toast);
      }, error => {
        const toast: Toast = {
          type: 'error',
          title: 'Oops! Error',
          body: 'Failed to create' + self.model.appId + ': ' + JSON.parse(error).error,
          timeout: 0,
          showCloseButton: true,
          bodyOutputType: BodyOutputType.TrustedHtml,
        };
        this.toasterService.popAsync(toast);

      });
  }

  // onCreateConfirm(event): void {
  //   const self = this;
  //   self.languageService
  //     .createAllLanguagePairs(self.appId, event.newData)
  //     .subscribe(result => {
  //       const toast: Toast = {
  //         type: 'success',
  //         title: 'Success',
  //         body: 'Successfully created',
  //         timeout: 0,
  //         showCloseButton: true,
  //         bodyOutputType: BodyOutputType.TrustedHtml,
  //       };
  //       this.toasterService.popAsync(toast);
  //       event.confirm.resolve();
  //     }, error => {
  //       const toast: Toast = {
  //         type: 'error',
  //         title: 'Oops! Error',
  //         body: 'Failed to create: ' + JSON.parse(error).error,
  //         timeout: 0,
  //         showCloseButton: true,
  //         bodyOutputType: BodyOutputType.TrustedHtml,
  //       };
  //       this.toasterService.popAsync(toast);
  //       event.confirm.reject();
  //     });
  // }

  // onEditConfirm(event): void {
  //   const self = this;

  //   self.languageService
  //     .updateAllLanguagePairs(self.appId, event.newData, event.data)
  //     .subscribe(result => {
  //       const toast: Toast = {
  //         type: 'success',
  //         title: 'Success',
  //         body: 'Successfully updated',
  //         timeout: 0,
  //         showCloseButton: true,
  //         bodyOutputType: BodyOutputType.TrustedHtml,
  //       };
  //       this.toasterService.popAsync(toast);
  //       event.confirm.resolve();
  //     }, error => {
  //       const toast: Toast = {
  //         type: 'error',
  //         title: 'Oops! Error',
  //         body: 'Failed to update: ' + JSON.parse(error).error,
  //         timeout: 0,
  //         showCloseButton: true,
  //         bodyOutputType: BodyOutputType.TrustedHtml,
  //       };
  //       this.toasterService.popAsync(toast);

  //       event.confirm.reject();
  //     });
  // }

  // onDeleteConfirm(event): void {
  //   const self = this;
  //   if (window.confirm('Are you sure you want to delete?')) {
  //     self.languageService
  //       .deleteAllLanguagePairs(self.appId, event.data)
  //       .subscribe(result => {
  //         const toast: Toast = {
  //           type: 'success',
  //           title: 'Success',
  //           body: 'Successfully deleted',
  //           timeout: 0,
  //           showCloseButton: true,
  //           bodyOutputType: BodyOutputType.TrustedHtml,
  //         };
  //         this.toasterService.popAsync(toast);

  //         event.confirm.resolve();
  //       }, error => {
  //         const toast: Toast = {
  //           type: 'error',
  //           title: 'Oops! Error',
  //           body: 'Failed to delete: ' + JSON.parse(error).error,
  //           timeout: 0,
  //           showCloseButton: true,
  //           bodyOutputType: BodyOutputType.TrustedHtml,
  //         };
  //         this.toasterService.popAsync(toast);

  //         event.confirm.reject();
  //       });
  //   } else {
  //     event.confirm.reject();
  //   }
  // }
}

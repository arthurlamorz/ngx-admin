import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable } from 'rxjs/Observable';
import { ToasterService, Toast, ToasterConfig, BodyOutputType } from 'angular2-toaster';

import { LanguageService, LanguageDetails } from '../../../services/cms-services/language.service';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-language-table',
  templateUrl: './language-table.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }

    :host ::ng-deep td {
      word-break: break-all;
    }
  `],
})
export class LanguageTableComponent implements OnInit {

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    pager: {
      perPage: 50,
    },
    columns: {
      key: {
        title: 'Key',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  public toasterConfig: ToasterConfig;
  constructor(
    private languageService: LanguageService,
    private toasterService: ToasterService,
  ) {

  }

  ngOnInit(): void {
    const self = this;

    self.toasterConfig = new ToasterConfig({
      positionClass: 'toast-top-full-width',
      timeout: 0,
      newestOnTop: true,
      tapToDismiss: true,
      preventDuplicates: true,
      animation: 'fade',
      limit: 5,
    });

    self.languageService.getLanguageList('Silvertooth')
      .subscribe(r => {
        const languageDetails: Observable<LanguageDetails>[] = [];
        const settings = JSON.parse(JSON.stringify(self.settings));

        r.languages.forEach(lanCode => {
          languageDetails.push(self.languageService.getLanguage('Silvertooth', lanCode))
          settings.columns[lanCode] = {
            title: lanCode,
            type: 'string',
          };
        });
        self.settings = settings;


        const lan = self.languageService.getAllLanguages('Silvertooth');
        lan.subscribe(result => {
          self.source.load(result);
        }, error => {

          const toast: Toast = {
            type: 'error',
            title: 'Oops! Error',
            body: 'Failed to get languages: ' + error.message,
            timeout: 0,
            showCloseButton: true,
            bodyOutputType: BodyOutputType.TrustedHtml,
          };
          this.toasterService.popAsync(toast);
        })
      }, error => {
        const toast: Toast = {
          type: 'error',
          title: 'Oops! Error',
          body: 'Failed to get languages: ' + error.message,
          timeout: 0,
          showCloseButton: true,
          bodyOutputType: BodyOutputType.TrustedHtml,
        };
        this.toasterService.popAsync(toast);
      });
  }

  onCreateConfirm(event): void {
    const self = this;
    self.languageService
      .createAllLanguagePairs('Silvertooth', event.newData)
      .subscribe(result => {
        const toast: Toast = {
          type: 'success',
          title: 'Success',
          body: 'Successfully created',
          timeout: 0,
          showCloseButton: true,
          bodyOutputType: BodyOutputType.TrustedHtml,
        };
        this.toasterService.popAsync(toast);
        event.confirm.resolve();
      }, error => {
        const toast: Toast = {
          type: 'error',
          title: 'Oops! Error',
          body: 'Failed to create: ' + JSON.parse(error).error,
          timeout: 0,
          showCloseButton: true,
          bodyOutputType: BodyOutputType.TrustedHtml,
        };
        this.toasterService.popAsync(toast);
        event.confirm.reject();
      });
  }

  onEditConfirm(event): void {
    const self = this;

    self.languageService
      .updateAllLanguagePairs('Silvertooth', event.newData, event.data)
      .subscribe(result => {
        const toast: Toast = {
          type: 'success',
          title: 'Success',
          body: 'Successfully updated',
          timeout: 0,
          showCloseButton: true,
          bodyOutputType: BodyOutputType.TrustedHtml,
        };
        this.toasterService.popAsync(toast);
        event.confirm.resolve();
      }, error => {
        const toast: Toast = {
          type: 'error',
          title: 'Oops! Error',
          body: 'Failed to update: ' + JSON.parse(error).error,
          timeout: 0,
          showCloseButton: true,
          bodyOutputType: BodyOutputType.TrustedHtml,
        };
        this.toasterService.popAsync(toast);

        event.confirm.reject();
      });
  }

  onDeleteConfirm(event): void {
    const self = this;
    if (window.confirm('Are you sure you want to delete?')) {
      self.languageService
        .deleteAllLanguagePairs('Silvertooth', event.data)
        .subscribe(result => {
          const toast: Toast = {
            type: 'success',
            title: 'Success',
            body: 'Successfully deleted',
            timeout: 0,
            showCloseButton: true,
            bodyOutputType: BodyOutputType.TrustedHtml,
          };
          this.toasterService.popAsync(toast);

          event.confirm.resolve();
        }, error => {
          const toast: Toast = {
            type: 'error',
            title: 'Oops! Error',
            body: 'Failed to delete: ' + JSON.parse(error).error,
            timeout: 0,
            showCloseButton: true,
            bodyOutputType: BodyOutputType.TrustedHtml,
          };
          this.toasterService.popAsync(toast);

          event.confirm.reject();
        });
    } else {
      event.confirm.reject();
    }
  }
}

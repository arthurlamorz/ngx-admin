import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable } from 'rxjs/Observable';
import { ToasterService, Toast, ToasterConfig, BodyOutputType } from 'angular2-toaster';

import { LanguageService, LanguageDetails } from '../../../services/cms-services/language.service';


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
  errorToasterConfig: ToasterConfig;
  constructor(
    private languageService: LanguageService,
    private toasterService: ToasterService,
  ) {

  }

  ngOnInit(): void {
    const self = this;

    self.errorToasterConfig = new ToasterConfig({
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
        const languageMappingsObservables: Observable<LanguageDetails>[] = [];

        const toast: Toast = {
          type: 'info',
          title: 'OK',
          body: 'Completed',
          timeout: 5,
          showCloseButton: true,
          bodyOutputType: BodyOutputType.TrustedHtml,
        };
        this.toasterService.popAsync(toast);
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
            toasterConfig: self.errorToasterConfig,
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
            toasterConfig: self.errorToasterConfig,
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
        event.confirm.resolve();
      }, error => {
        alert(JSON.stringify(error));
        event.confirm.reject();
      });
  }

  onEditConfirm(event): void {
    const self = this;

    self.languageService
      .updateAllLanguagePairs('Silvertooth', event.newData, event.data)
      .subscribe(result => {
        event.confirm.resolve();
      }, error => {
        alert(JSON.stringify(error));
        event.confirm.reject();
      });
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}

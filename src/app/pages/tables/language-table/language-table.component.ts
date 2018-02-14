import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable } from 'rxjs/Observable';
import { ToasterService, Toast, ToasterConfig, BodyOutputType } from 'angular2-toaster';

import { LanguageService, LanguageDetails } from '../../../services/cms-services/language.service';

@Component({
  selector: 'ngx-language-table',
  templateUrl: './language-table.component.html',
  styleUrls: ['./language-table.component.scss'],
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
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
        type: 'number',
      },
      value: {
        title: 'Text',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  toasterConfig: ToasterConfig;
  constructor(
    private languageService: LanguageService,
    private toasterService: ToasterService,
  ) {

  }

  ngOnInit(): void {
    const self = this;

    self.languageService.getlanguageList('Silvertooth')
      .subscribe(r => {
        const languageMappingsObservables: Observable<LanguageDetails>[] = [];

        r.languages.forEach(
          l => languageMappingsObservables.push(
            self.languageService.getLanguage('Silvertooth', l)));

        Observable.forkJoin(languageMappingsObservables).subscribe(results => {
          results.forEach(l => self.source.load(l.mappings));
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
        }, () => {
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
            type: 'info',
            title: 'OK',
            body: 'Completed',
            timeout: 5,
            showCloseButton: true,
            bodyOutputType: BodyOutputType.TrustedHtml,
          };
          this.toasterService.popAsync(toast);
        });

      }, error => {
        alert(JSON.stringify(error));
      });
  }
  onCreateConfirm(event): void {
    const self = this;
    const languageCode = 'zh-HANT'
    self.languageService
      .createLanguagePair('Silvertooth', languageCode, event.newData.key, event.newData.value)
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

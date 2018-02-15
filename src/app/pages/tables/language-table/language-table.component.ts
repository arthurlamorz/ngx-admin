import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { LanguageService, LanguageDetails } from '../../../services/cms-services/language.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ngx-language-table',
  templateUrl: './language-table.component.html',
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

  constructor(
    private languageService: LanguageService,
  ) {

  }

  ngOnInit(): void {
    const self = this;

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
          alert(JSON.stringify(error));
        });
      }, error => {
        alert(JSON.stringify(error));
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
    const self = this;
    if (window.confirm('Are you sure you want to delete?')) {
      self.languageService
        .deleteLanguagePair('Silvertooth', event.data.key)
        .subscribe(result => {
          event.confirm.resolve();
        }, error => {
          event.confirm.resolve();
        });
    } else {
      event.confirm.reject();
    }
  }
}

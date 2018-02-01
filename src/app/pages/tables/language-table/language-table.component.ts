import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { LanguageService } from '../../../services/cms-services/language.service';

@Component({
  selector: 'ngx-language-table',
  templateUrl: './language-table.component.html',
  styles: [`
    nb-card {ß
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

  constructor(
    private languageService: LanguageService,
  ) {

  }

  ngOnInit(): void {
    const self = this;
    self.languageService.getLanguage('Silvertooth', 'zh-HANT')
      .subscribe(r => {
        self.source.load(r.mappings)
      }, error => {
        alert(JSON.stringify(error));
      });

    self.languageService.getlanguageList('Silvertooth')
      .subscribe(r => {
        alert(JSON.stringify(r));
      }, error => {
        alert(JSON.stringify(error));
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

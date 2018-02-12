import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { LanguageService, LanguageDetails } from '../../../services/cms-services/language.service';
import { Observable } from 'rxjs/observable';
import { forkJoin } from 'rxjs/observable/forkJoin';

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

    self.languageService.getlanguageList('Silvertooth')
      .subscribe(r => {
        const languageDetails: Observable<LanguageDetails>[] = [];
        var settings = JSON.parse(JSON.stringify(self.settings));
        
        r.languages.forEach(l => {
          languageDetails.push(self.languageService.getLanguage('Silvertooth', l))
          settings.columns[l] = {
            title: l,
            type: 'string',
          };
        });
        self.settings = settings;


        const lan = forkJoin(languageDetails);
        lan.subscribe(result => {
          
          result.forEach(lan =>{ 
            alert(JSON.stringify(lan));
          });
      
        }, error => {
          alert(JSON.stringify(error));
        }, () => {
          alert('completed!');
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

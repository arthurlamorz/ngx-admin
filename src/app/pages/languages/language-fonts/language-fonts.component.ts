import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ActivatedRoute } from '@angular/router';

import { ToasterService, Toast, ToasterConfig, BodyOutputType } from 'angular2-toaster';

import { LanguageService } from '../../../services/cms-services/language.service';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-language-fonts',
  templateUrl: './language-fonts.component.html',
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
export class LanguageFontsComponent implements OnInit, OnDestroy {

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
      languageCode: {
        title: 'Language',
        type: 'string',
        width: '100px',
      },
      fontName: {
        title: 'Font Name',
        type: 'string',
        width: '250px',
      },
      'xs': {
        title: 'Font Size Xtra Small',
        type: 'number',
        width: '100px',
      },
      'sm': {
        title: 'Font Size Small',
        type: 'number',
        width: '100px',
      },
      'md': {
        title: 'Font Size Medium',
        type: 'number',
        width: '100px',
      },
      'lg': {
        title: 'Font Size Large',
        type: 'number',
        width: '100px',
      },
      'xl': {
        title: 'Font Size Xtra Large',
        type: 'number',
        width: '100px',
      },
    },
  };

  private sub;
  private appId;

  source: LocalDataSource = new LocalDataSource();
  public toasterConfig: ToasterConfig;
  constructor(
    private languageService: LanguageService,
    private toasterService: ToasterService,
    private route: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    const self = this;

    self.sub = self.route.params.subscribe(params => {
      self.appId = params['appid'];
    });

    self.toasterConfig = new ToasterConfig({
      positionClass: 'toast-top-full-width',
      timeout: 0,
      newestOnTop: true,
      tapToDismiss: true,
      preventDuplicates: true,
      animation: 'fade',
      limit: 5,
    });

    self.languageService.getAllFonts(self.appId)
      .subscribe(fonts => {
        const fontTableRows = [];
        fonts.forEach(f => {
          fontTableRows.push({
            languageCode: f.languageCode,
            fontName: f.fontName,
            xs: Number(f.fontSizes.xs),
            sm: Number(f.fontSizes.sm),
            md: Number(f.fontSizes.md),
            lg: Number(f.fontSizes.lg),
            xl: Number(f.fontSizes.xl),
          })
        });

        self.source.load(fontTableRows);
      }, error => {

        const toast: Toast = {
          type: 'error',
          title: 'Oops! Error',
          body: 'Failed to get fonts: ' + error.message,
          timeout: 0,
          showCloseButton: true,
          bodyOutputType: BodyOutputType.TrustedHtml,
        };
        this.toasterService.popAsync(toast);
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onCreateOrEditConfirm(event): void {
    const self = this;
    const newData = event.newData;
    const fontObj = {
      gameId: self.appId,
      languageCode: newData.languageCode,
      fontName: newData.fontName,
      fontSizes: {
        xs: Number(newData.xs),
        sm: Number(newData.sm),
        md: Number(newData.md),
        lg: Number(newData.lg),
        xl: Number(newData.xl),
      },
    };
    self.languageService.updateFonts(fontObj)
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

  onDeleteConfirm(event): void {
    const self = this;
    if (window.confirm('Are you sure you want to delete?')) {
      self.languageService
        .deleteAllLanguagePairs(self.appId, event.data)
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

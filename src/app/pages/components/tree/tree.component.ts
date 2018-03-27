import { Component, OnInit, OnDestroy } from '@angular/core';
import { TreeModel } from 'ng2-tree';
import { ActivatedRoute } from '@angular/router';

import { ToasterService, Toast, ToasterConfig, BodyOutputType } from 'angular2-toaster';

import { ModelService } from '../../../services/cms-services/model.service';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-tree',

  styleUrls: ['./tree.component.scss'],
  templateUrl: './tree.component.html',
})
export class TreeComponent implements OnInit, OnDestroy {

  private sub;
  public appId;

  tree: TreeModel = {
    settings: {
      'rightMenu': true,
      menuItems: [
        { action: null, name: 'Add parent node', cssClass: '' },
        { action: null, name: 'Add child node', cssClass: '' },
        { action: null, name: 'Remove node', cssClass: '' },
        { action: null, name: 'Rename node', cssClass: '' },
        { action: null, name: 'Custom Action', cssClass: '' },
      ],
    },
    value: 'Programming languages by programming paradigm',
    children: [{
      value: 'Object-oriented programming',
      children: [{
        value: 'Java',
      }, {
        value: 'C++',
      }, {
        value: 'C#',
      }],
    }, {
      value: 'Prototype-based programming',
      children: [{
        value: 'JavaScript',
      }, {
        value: 'CoffeeScript',
      }, {
        value: 'Lua',
      }],
    }],
  };

  public toasterConfig: ToasterConfig;
  constructor(
    private modelService: ModelService,
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

    self.modelService.getAllModels(self.appId)
      .subscribe(models => {

        alert(JSON.stringify(models));

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

}

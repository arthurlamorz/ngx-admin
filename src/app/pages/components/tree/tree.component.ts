import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { TreeModel, NodeMenuItemAction } from 'ng2-tree';
import { ActivatedRoute } from '@angular/router';

import { ToasterService, Toast, ToasterConfig, BodyOutputType } from 'angular2-toaster';

import { ModelService, ModelContent } from '../../../services/cms-services/model.service';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-tree',

  styleUrls: ['./tree.component.scss'],
  templateUrl: './tree.component.html',
})
export class TreeComponent implements OnInit, OnDestroy {

  @ViewChild('treeComponent') treeComponent;

  private sub;
  public appId;
  public modelList;

  private menuItemsMap = [
    { 'key': 'addString', 'value': 'Add string field', 'type': 'string' },
    { 'key': 'addNumber', 'value': 'Add number field', 'type': 'number' },
    { 'key': 'addBoolean', 'value': 'Add boolean field', 'type': 'boolean' },
    { 'key': 'addObject', 'value': 'Add an object', 'type': 'object' },
    { 'key': 'rename', 'value': 'Rename', 'type': null },
    { 'key': 'delete', 'value': 'Delete', 'type': null },
  ]

  private tree: TreeModel;
  private rootNodeId: number;

  public toasterConfig: ToasterConfig;
  constructor(
    private modelService: ModelService,
    private toasterService: ToasterService,
    private route: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    const self = this;

    const menuItems = this.menuItemsMap
      .map(i => {
        return {
          'action': NodeMenuItemAction.Custom,
          'name': i.value,
          'cssClass': '',
        }
      })

    self.rootNodeId = Math.floor(99999999999 * Math.random())

    self.tree = {
      settings: {
        'rightMenu': true,
        menuItems: menuItems,
      },
      value: 'New Object',
      type: 'object',
      id: self.rootNodeId,
      children: [],
    };

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

    self.modelService.getModelList(self.appId)
      .subscribe(r => {
        self.modelList = r.models;
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

  popToast(type: string, title: string, text: string): void {
    const toast: Toast = {
      type: type,
      title: title,
      body: text,
      timeout: 0,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.toasterService.popAsync(toast);
  }

  changeModel(model: string): void {
    const self = this;
    if (!model)
      self.popToast('error', 'Error when change model', 'Model not found')
      let rootNodeController = self.treeComponent.getControllerByNodeId(self.rootNodeId);
      rootNodeController.setChildren([]);

    self.modelService.getModel(self.appId, model)
      .subscribe(m => {
        rootNodeController = self.treeComponent.getControllerByNodeId(self.rootNodeId);
        rootNodeController.addChild(self.deserializeTreeModel(m.model));
      },
        error => {
          self.popToast('error', 'Error when change model', JSON.stringify(error))
        })
  }

  onMenuItemSelected($event): void {
    const self = this;

    const node = $event.node;
    const actionItem = self.menuItemsMap.filter(
      i => i.value === $event.selectedItem,
    )[0];
    const nodeController = self.treeComponent.getControllerByNodeId(node.id);
    if (actionItem.key === 'delete') {
      nodeController.remove();
    } else if (actionItem.key === 'rename') {
      nodeController.startRenaming();
    } else {

      const menuItems = this.menuItemsMap
        .map(i => {
          return {
            'action': NodeMenuItemAction.Custom,
            'name': i.value,
            'cssClass': '',
          }
        })

      const childNode: TreeModel = {
        'value': 'name here',
        'type': actionItem.type,
        'id': Math.floor(99999999999 * Math.random()),
        settings: {
          'rightMenu': true,
          menuItems: menuItems,
        },
      };

      if (actionItem.type === 'object')
        childNode.children = []

      nodeController.addChildAsync(childNode).then(
        n => {
          const newNodeController = self.treeComponent.getControllerByNodeId(n.node.id);
          newNodeController.startRenaming();
        },
      );
    }
  }

  serializeTreeModel(treeModel: TreeModel): ModelContent {
    const self = this;
    const newModelContent: ModelContent = {
      type: treeModel.type,
      name: treeModel.value.toString(),
    };

    if (!treeModel.children || treeModel.children.length <= 0)
      return newModelContent;
    else {
      newModelContent.children = [];
      treeModel.children.forEach(child => {
        newModelContent.children.push(self.serializeTreeModel(child));
      });
      return newModelContent
    }

  }

  deserializeTreeModel(modelContent: ModelContent): TreeModel {
    const self = this;
    const newTreeModel: TreeModel = {
      type: modelContent.type,
      value: modelContent.name,
      id: Math.floor(99999999999 * Math.random()),
      settings: {
        menuItems: this.menuItemsMap
          .map(i => {
            return {
              'action': NodeMenuItemAction.Custom,
              'name': i.value,
              'cssClass': '',
            }
          }),
      },
    };

    if (!modelContent.children || modelContent.children.length <= 0)
      return newTreeModel;
    else {
      newTreeModel.children = [];
      modelContent.children.forEach(child => {
        newTreeModel.children.push(self.deserializeTreeModel(child));
      });
      return newTreeModel
    }

  }

  updateModel(): void {
    const self = this;

    const rootNodeController = self.treeComponent.getControllerByNodeId(self.rootNodeId);
    const treeModel = rootNodeController.toTreeModel();
    const modelContent = self.serializeTreeModel(treeModel.children[0]);

    self.modelService.updateModel(self.appId, modelContent.name, modelContent)
      .subscribe(result => {
        self.popToast('success', 'Success', 'Successfully updated')
      }, error => {
        self.popToast('error', 'Oops! Error', 'Failed to update: ' + JSON.parse(error).error)
      })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}

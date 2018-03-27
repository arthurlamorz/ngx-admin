import { Component } from '@angular/core';
import { TreeModel } from 'ng2-tree';

@Component({
  selector: 'ngx-tree',
  
  styleUrls:['./tree.component.scss'],
  templateUrl: './tree.component.html',
})
export class TreeComponent {

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

}

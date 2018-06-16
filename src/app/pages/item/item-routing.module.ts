import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemComponent } from './item.component';
import { UpdateItemComponent } from './update-item/update-item.component';

const routes: Routes = [{
  path: '',
  component: ItemComponent,
  children: [{
    path: 'update-item',
    component: UpdateItemComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemRoutingModule { }

export const routedComponents = [
  ItemComponent,
  UpdateItemComponent,
];

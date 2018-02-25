import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppListComponent } from './app-list.component';
import { CreateAppComponent } from './create-app/create-app.component';

const routes: Routes = [{
  path: '',
  component: AppListComponent,
  children: [{
    path: 'create-app',
    component: CreateAppComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppListRoutingModule { }

export const routedComponents = [
  AppListComponent,
  CreateAppComponent,
];

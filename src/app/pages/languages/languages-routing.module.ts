import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TablesComponent } from './languages.component';
import { LanguageFontsComponent } from './language-fonts/language-fonts.component';
import { LanguageTableComponent } from './language-table/language-table.component';

const routes: Routes = [{
  path: '',
  component: TablesComponent,
  children: [{
    path: 'fonts:appid',
    component: LanguageFontsComponent,
  },
  {
    path: 'language-table/:appid',
    component: LanguageTableComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablesRoutingModule { }

export const routedComponents = [
  TablesComponent,
  LanguageFontsComponent,
  LanguageTableComponent,
];

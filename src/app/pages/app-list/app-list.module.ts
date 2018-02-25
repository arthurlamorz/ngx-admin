import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterModule } from 'angular2-toaster';

import { ThemeModule } from '../../@theme/theme.module';
import { AppListRoutingModule, routedComponents } from './app-list-routing.module';

@NgModule({
  imports: [
    ThemeModule,
    AppListRoutingModule,
    Ng2SmartTableModule,
    ToasterModule,
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
  ],
})
export class AppListModule { }

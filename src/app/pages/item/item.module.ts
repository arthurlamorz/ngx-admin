import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterModule } from 'angular2-toaster';

import { ThemeModule } from '../../@theme/theme.module';
import { ItemRoutingModule, routedComponents } from './item-routing.module';

@NgModule({
  imports: [
    ThemeModule,
    ItemRoutingModule,
    Ng2SmartTableModule,
    ToasterModule,
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
  ],
})
export class ItemModule { }

import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAuthModule } from '@nebular/auth';
import { AwsCognitoAuthProvider } from '../auth/aws-cognito.provider';
import { UserLoginService } from '../services/cognito-services/user-login.service';
import { CognitoUtil } from '../services/cognito-services/cognito.service';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { DataModule } from './data/data.module';
import { AnalyticsService } from './utils/analytics.service';
import { UserRegistrationService } from '../services/cognito-services/user-registration.service';
import { CognitoAuthInterceptor } from '../services/interceptors/cognito.http.interceptor';
import { AppListService } from '../services/cms-services/app-list.service';
import { LanguageService } from '../services/cms-services/language.service';
import { ModelService } from '../services/cms-services/model.service';
import { ItemService } from '../services/cms-services/item.service';

const NB_CORE_PROVIDERS = [
  ...DataModule.forRoot().providers,
  ...NbAuthModule.forRoot({
    providers: {
      email: {
        service: AwsCognitoAuthProvider,
        config: {
          delay: 3000,
          login: {
            rememberMe: true,
          },
        },
      },
    },
  }).providers,
  AnalyticsService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    NbAuthModule,
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
        AwsCognitoAuthProvider,
        UserLoginService,
        UserRegistrationService,
        CognitoUtil,
        CognitoAuthInterceptor,
        AppListService,
        LanguageService,
        ModelService,
        ItemService
      ],
    };
  }
}

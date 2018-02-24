import { Injectable } from '@angular/core';
import {
  NbAbstractAuthProvider,
  NbAuthResult,
} from '@nebular/auth';
import { Observable } from 'rxjs/Observable';
import { UserLoginService } from '../services/cognito-services/user-login.service';
import { UserRegistrationService } from '../services/cognito-services/user-registration.service';
import { UserData } from '../services/cognito-services/cognito.service';


export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthConfig {
  apiAddress: string;
}


@Injectable()
export class AwsCognitoAuthProvider extends NbAbstractAuthProvider {
  protected defaultConfig: AuthConfig = {
    apiAddress: 'http://example.com/accesstoken',
  };
  protected config: AuthConfig;

  constructor(
    public loginService: UserLoginService,
    public registrationService: UserRegistrationService,
  ) {
    super();
  }

  logout(): Observable<NbAuthResult> {
    const self = this;
    self.loginService.logout();

    return new Observable<NbAuthResult>(obs => {
      obs.next(new NbAuthResult(true, null, '/auth/login'));
      obs.complete();
    });
  }

  authenticate(user: UserData): Observable<NbAuthResult> {
    const self = this;
    return self.loginService.authenticate(user.email, user.password);
  }

  getConfigValue(key: string) {
    return this.config[key];
  }
  register(data?: UserData): Observable<NbAuthResult> {
   const self = this;
   return self.registrationService.register(data);
  }
  requestPassword(data?: UserData): Observable<NbAuthResult> {
    throw new Error('Method not implemented.');
  }
  resetPassword(data?: UserData): Observable<NbAuthResult> {
    throw new Error('Method not implemented.');
  }
}

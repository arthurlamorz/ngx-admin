import { Injectable } from '@angular/core';
import {
  NbAbstractAuthProvider,
  NbAuthResult,
} from '@nebular/auth';
import { Observable } from 'rxjs/Observable';
import { UserLoginService } from '../services/user-login.service';

export interface UserData {
  email: string;
  username: string;
  password: string;
}

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
  ) {
    super();
  }

  logout(): Observable<NbAuthResult> {
    // return this.authService.logout('name');
    return Observable.of(new NbAuthResult(
      true,
      {},
      '/',
      false,
      'Sign out success.',
    ));
  }

  authenticate(user: UserData): Observable<NbAuthResult> {
    const self = this;
    return self.loginService.authenticate(user.email, user.password);
  }

  getConfigValue(key: string) {
    return this.config[key];
  }
  register(data?: UserData): Observable<NbAuthResult> {
    throw new Error('Method not implemented.');
  }
  requestPassword(data?: UserData): Observable<NbAuthResult> {
    throw new Error('Method not implemented.');
  }
  resetPassword(data?: UserData): Observable<NbAuthResult> {
    throw new Error('Method not implemented.');
  }
}

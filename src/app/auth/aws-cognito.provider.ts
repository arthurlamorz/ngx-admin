import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {
  NbAbstractAuthProvider,
  NbAuthResult,
  NbAuthSimpleToken,
} from '@nebular/auth';
import { Observable } from 'rxjs/Observable';

export interface UserData {
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
export class AwsCognitoAuthProvider  extends NbAbstractAuthProvider {
  protected defaultConfig: AuthConfig = {
    apiAddress: 'http://example.com/accesstoken',
  };
  protected config: AuthConfig;

  constructor(
    private httpClient: HttpClient,
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
    const headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const body = `grant_type=password&username=${user.username}&password=${user.password}`;

    return this.httpClient.post<TokenResponse>(
      this.config.apiAddress,
      body, {
        headers,
      },
    )
    .map((res: TokenResponse) => {
      const token = new NbAuthSimpleToken();
      token.setValue(res.access_token);

      return new NbAuthResult(
        true,
        res,
        '/',
        false,
        `Sign in successful!`,
        token,
      );
    })
    .catch((res) => {
      let errors = [];
      if (res instanceof HttpErrorResponse) {
        errors = ['Wrong combination of username/password.'];
      } else {
        errors.push('Something went wrong.');
      }

      return Observable.of(
        new NbAuthResult(
          false,
          res,
          null,
          errors,
        ));
    });
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

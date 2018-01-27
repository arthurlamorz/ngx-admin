import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CognitoUtil } from '../cognito.service';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class CognitoAuthInterceptor implements HttpInterceptor {
    constructor(public cognitoUtil: CognitoUtil) {

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const self = this;
        return self.cognitoUtil.observeIdToken().mergeMap(token => {
            if (token) {
                req = req.clone({
                    setHeaders: {
                        Authorization: token,
                    },
                });
            }
            return next.handle(req);
        });
    }
}


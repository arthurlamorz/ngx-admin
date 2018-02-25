import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { UserLoginService } from '../services/cognito-services/user-login.service';
// import { AlertsService } from '../alerts/alerts.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router,
        private userLoginService: UserLoginService,
        // private alertsService: AlertsService
    ) { }

    canActivate(next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean> | Promise<boolean> | boolean {

        const self = this;
        return new Observable<boolean>(obs => {
            self.userLoginService.isLoggedIn().subscribe(
                isValid => {
                    if (!isValid) {
                        this.router
                            .navigate(['/auth/login'], { queryParams: { redirectUrl: state.url } })
                            .then(() => { });
                    }
                    obs.next(isValid);
                    obs.complete();
                },
            );
        })
    }
}

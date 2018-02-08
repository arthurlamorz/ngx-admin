
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

export interface AppList {
    appList: AppDetail[]
}

export interface AppDetail {
    appName: string,
    description: string
}

@Injectable()
export class AppListService {

    constructor( private http: HttpClient) {
    }

    listApp(): Observable<AppList> {
        const observable = new Observable<AppList>(
            obs => {
                this.http.get(environment.service_base_url +  environment.service_applist_endpoint)
                .subscribe(resp => {
                    obs.next(resp as AppList);
                }, error => {
                    obs.error(error);
                });
            },
        );
        return observable;

    }
}

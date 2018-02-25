
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

export interface AppList {
    appList: AppData[]
}

export class AppDetails {
    appName: string;
    description: string;
}

export class AppData {
    appId: string;
    ownerId: string;
    details: AppDetails;
}

@Injectable()
export class AppListService {

    constructor( private http: HttpClient) {
    }

    listApp(): Observable<AppList> {
        const observable = new Observable<AppList>(
            obs => {
                this.http.get(environment.service_base_url + environment.service_applist_endpoint)
                .subscribe(resp => {
                    obs.next(resp as AppList);
                }, error => {
                    obs.error(error);
                });
            },
        );
        return observable;

    }

    createApp(app: AppData): Observable<String> {
        const observable = new Observable<String>(
            obs => {
                this.http.post(
                    environment.service_base_url + environment.service_applist_endpoint,
                    app)
                .subscribe(result => {
                        obs.next('');
                        obs.complete();
                    },
                    error => obs.error(JSON.stringify(error)),
                )
            },
        );
        return observable;

    }
}

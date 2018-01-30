
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

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
                this.http.get('https://api.goblin-software.com/cms')
                .subscribe(resp => {
                    obs.next(resp as AppList);
                }, error => {
                    alert(JSON.stringify(error.message));
                });
            },
        );
        return observable;

    }
}


import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface ItemList {
    version: number;
    items: Item[];
}

export interface Item {
    ItemKey: string,
    ItemContent: any
}


@Injectable()
export class ItemService {

    constructor(private http: HttpClient) {
    }

    getItemList(appId: string): Observable<ItemList> {
        const observable = new Observable<ItemList>(
            obs => {
                this.http.get(environment.service_base_url + environment.service_cms_endpoint + '/' +
                    environment.service_item_resource + '/' + appId)
                    .subscribe(resp => {
                        obs.next(resp as ItemList);
                        obs.complete();
                    }, error => {
                        obs.error(JSON.stringify(error.message));
                    });
            },
        );
        return observable;
    }

    getItem(appId: string,
            modelName: string,
            itemKey?: string,
            version?: number,
            returnDummyWhenError?: boolean): Observable<ItemList> {

        const self = this;

        return new Observable<ItemList>(
            obs => {
                let urlString = environment.service_base_url + environment.service_cms_endpoint + '/' +
                    environment.service_item_resource + '/' + appId + '/' + modelName;

                if (itemKey)
                    urlString = urlString + '/' + itemKey;
                if (version)
                    urlString = urlString + '?version=' + version;

                self.http.get(urlString)
                    .subscribe(resp => {
                        obs.next(resp as ItemList);
                        obs.complete();
                    }, error => {

                        if (returnDummyWhenError) {
                            obs.next({
                                version: -1,
                                items: [],
                            });
                            obs.complete();
                        } else
                            obs.error(JSON.stringify(error))
                    })
            },
        );
    }

    updateItem(appId: string, modelName: string, itemKey: string, itemContent: any): Observable<string> {
        const self = this;

        return new Observable<string>(
            obs => {
                const urlString = environment.service_base_url + environment.service_cms_endpoint + '/' +
                    environment.service_item_resource + '/' + appId + '/' + modelName + '/' + itemKey;

                self.http.post(urlString, itemContent)
                    .subscribe(
                        result => {
                            obs.next('');
                            obs.complete();
                        },
                        error => obs.error(JSON.stringify(error)),
                );
            },
        );

    }
}


import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkjoin';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface ModelList {
    models: string[];
}

export interface ItemModel {
    version: number,
    model: ModelContent
}

export interface ModelContent {
    type: string;
    name: string;
    children?: ModelContent[];
}

@Injectable()
export class ModelService {

    constructor(private http: HttpClient) {
    }

    getModelList(appId: string): Observable<ModelList> {
        const observable = new Observable<ModelList>(
            obs => {
                this.http.get(environment.service_base_url + environment.service_cms_endpoint + '/' +
                    environment.service_model_resource + '/' + appId)
                    .subscribe(resp => {
                        obs.next(resp as ModelList);
                        obs.complete();
                    }, error => {
                        obs.error(JSON.stringify(error.message));
                    });
            },
        );
        return observable;
    }

    getModel(appId: string,
            modelName: string,
            version?: number,
            returnDummyWhenError?: boolean): Observable<ItemModel> {

        const self = this;

        return new Observable<ItemModel>(
            obs => {
                let urlString = environment.service_base_url + environment.service_cms_endpoint + '/' +
                    environment.service_model_resource + '/' + appId + '/' + modelName;

                if (version)
                    urlString = urlString + '?version=' + version;

                self.http.get(urlString)
                    .subscribe(resp => {
                        obs.next(resp as ItemModel);
                        obs.complete();
                    }, error => {

                        if (returnDummyWhenError) {
                            obs.next({
                                version: -1,
                                model: {
                                    name: modelName,
                                    type: null,
                                },
                            });
                            obs.complete();
                        } else
                            obs.error(JSON.stringify(error))
                    })
            },
        );
    }

    getAllModels(appId: string, version?: number): Observable<ItemModel[]> {
        const self = this;

        const observable = new Observable<ItemModel[]>(
            obs => {
                self.getModelList(appId).subscribe(
                    modelList => {
                        const modelObvs: Observable<ItemModel>[] = [];

                        // catch the 404 error and return an empty object
                        modelList.models.forEach(m => {

                            const modelObv = self.getModel(appId, m, version, true);
                            modelObvs.push(modelObv);
                        });


                        forkJoin(modelObvs).subscribe(
                            models => {
                                obs.next(models);
                                obs.complete();
                            }, error => {
                                obs.error(error);
                            });

                    }, error => {
                        obs.error(error);
                    },
                );
            },
        );

        return observable;

    }


    updateModel(appId: string, modelName: string, modelContent: ModelContent): Observable<string> {
        const self = this;

        return new Observable<string>(
            obs => {
                const urlString = environment.service_base_url + environment.service_cms_endpoint + '/' +
                    environment.service_model_resource + '/' + appId + '/' + modelName;

                self.http.post(urlString, modelContent)
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

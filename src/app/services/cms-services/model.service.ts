
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkjoin';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { integer } from 'aws-sdk/clients/storagegateway';

export interface ModelList {
    models: string[];
}

export interface Model {
    type: string;
    name: string;
    children?: Model[];
}

@Injectable()
export class ModelService {

    constructor(private http: HttpClient) {
    }

    getModelList(appId: string): Observable<ModelList> {
        const observable = new Observable<ModelList>(
            obs => {
                this.http.get(environment.service_base_url + '/' + environment.service_model_endpoint
                    + '/' + appId)
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

    getModel(appId: string, modelName: string, version?: integer): Observable<Model> {
        const self = this;

        return new Observable<Model>(
            obs => {
                var urlString = environment.service_base_url + '/' + environment.service_model_endpoint
                    + '/' + appId + '/' + modelName;

                if (version)
                    urlString = urlString + '?version=' + version;

                self.http.get(urlString)
                    .subscribe(resp => {
                        obs.next(resp as Model);
                        obs.complete();
                    }, error => {
                        obs.error(JSON.stringify(error.message));
                    })
            },
        );
    }

    getAllModels(appId: string): Observable<Model[]> {
        const self = this;
        
        const observable = new Observable<Model[]>(
            obs => {
                self.getModelList(appId).subscribe(
                    modelList => {
                        const modelObvs: Observable<Model>[] = [];
                        let models: Model[] = [];
                        modelList.models.forEach(m => {
                            modelObvs.push(self.getModel(appId, m)
                                // catch the 404 error and cforget about it
                                .catch(err => {
                                    return new Observable<Model>(
                                        errObs => {
                                            errObs.next({
                                                name: m,
                                                type: null      
                                            });
                                            errObs.complete();
                                        },
                                    );
                                }));
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


    updateModel(appId: string, modelName: string, theModel: Model): Observable<string> {
        const self = this;

        return new Observable<string>(
            obs => {
                var urlString = environment.service_base_url + '/' + environment.service_model_endpoint
                    + '/' + appId + '/' + modelName;

                self.http.post(urlString, theModel)
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

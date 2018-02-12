
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

export interface KeyMapping {
    key: string;
    value: string;
}
export interface LanguageDetails {
    gameId: string;
    languageCode: string;
    mappings: KeyMapping[];
}
export interface LanguageFont {
    fontName: string;
    fontSizes: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
    };
    gameId: string;
    languageCode: string;
}
export interface Value {
    value: string;
}

export interface LanguageList {
    languages: string[];
}


@Injectable()
export class LanguageService {

    constructor( private http: HttpClient) {
    }

    getlanguageList(appId: string): Observable<LanguageList> {
        const observable = new Observable<LanguageList>(
            obs => {
                this.http.get(environment.service_base_url + environment.service_language_endpoint
                    + '/' + appId)
                .subscribe(resp => {
                    obs.next(resp as LanguageList);
                    obs.complete();
                }, error => {
                    obs.error(JSON.stringify(error.message));
                });
            },
        );
        return observable;
    }


    getLanguage(appId: string, languageCode: string): Observable<LanguageDetails> {
        const observable = new Observable<LanguageDetails>(
            obs => {
                this.http.get(environment.service_base_url + environment.service_language_endpoint
                    + '/' + appId + '/' + languageCode)
                .subscribe(resp => {
                    obs.next(resp as LanguageDetails);
                    obs.complete();
                }, error => {
                    obs.error(JSON.stringify(error.message));
                });
            },
        );
        return observable;

    }

    createLanguagePair(
        appId: string,
        languageCode: string,
        key: string,
        value: string): Observable<string> {

            const self = this;

            return new Observable<string>(
                obs => {
                    self.http.post(environment.service_base_url + environment.service_language_endpoint
                        + '/' + appId + '/' + languageCode + '/' + key,
                        {
                            value: value,
                        })
                        .subscribe(
                            result => {
                                obs.next(''); obs.complete()
                            },
                            error => obs.error(JSON.stringify(error)),
                        );
                },
            );

        }
}

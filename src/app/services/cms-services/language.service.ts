
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkjoin';
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

export interface LanguageMappings {
    key: string;
}

@Injectable()
export class LanguageService {

    constructor( private http: HttpClient) {
    }

    getLanguageList(appId: string): Observable<LanguageList> {
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

    getAllLanguages(appId: string): Observable<LanguageMappings[]> {
        const self = this;
        const observable = new Observable<LanguageMappings[]>(
            obs => {
                self.getLanguageList(appId).subscribe(
                    langList => {
                        const langDetailObvs: Observable<LanguageDetails>[] = [];
                        let languageMappings: LanguageMappings[] = [];
                        langList.languages.forEach(l => {
                            langDetailObvs.push(self.getLanguage(appId, l));
                        });


                        forkJoin(langDetailObvs).subscribe(
                            langDetails => {
                                languageMappings = langDetails[0].mappings.map(m => {
                                    const newMap: LanguageMappings = {
                                        key: m.key.substring(m.key.indexOf('_') + 1),
                                    };
                                    return newMap;
                                });

                                langDetails.forEach(langMap => {
                                    languageMappings = langMap.mappings.map(lm => {
                                        let newMap: LanguageMappings = languageMappings
                                            .find(m => m.key.substring(m.key.indexOf('_') + 1)
                                                    === lm.key.substring(lm.key.indexOf('_') + 1));

                                        if (!newMap)
                                            newMap = {
                                                key: lm.key,
                                            };

                                        newMap[langMap.languageCode] = lm.value;
                                        return newMap;
                                    });
                                });

                                obs.next(languageMappings);
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

    updateAllLanguagePairs (
        appId: string,
        newMappings: LanguageMappings,
        oldMappings: LanguageMappings,
    ): Observable<boolean> {
        const self = this;
        for (const lanCode in newMappings) {
            if (newMappings[lanCode] === oldMappings[lanCode] && lanCode !== 'key')
                delete newMappings[lanCode];
        }
        return self.createAllLanguagePairs(appId, newMappings);
    }

    createAllLanguagePairs (
        appId: string,
        languageMappings: LanguageMappings,
    ): Observable<boolean> {
        return new Observable<boolean> (obs => {
            const self = this;
            const key = languageMappings.key;
            const createLanguageObvs: Observable<string>[] = [];

            for (const lanCode in languageMappings) {
                if (lanCode !== 'key') {
                    createLanguageObvs.push(
                        self.createLanguagePair(appId, lanCode, key, languageMappings[lanCode]));
                }
            }

            forkJoin(createLanguageObvs).subscribe(results => {

            }, error => {
                obs.error(error);
            }, () => {
                obs.next(true);
                obs.complete();
            });

        });

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
                                obs.next('');
                                obs.complete();
                            },
                            error => obs.error(JSON.stringify(error)),
                        );
                },
            );

        }
}

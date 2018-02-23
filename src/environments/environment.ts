/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  region: 'ap-northeast-1',

  identityPoolId: 'ap-northeast-1:b7b4c70f-40bb-48e5-aa89-e1d97da050dc',
  userPoolId: 'ap-northeast-1_ZDFO8ejOi',
  clientId: '4qk4jla0i29j1dhkh8ck9g1ics',

  cognito_idp_endpoint: '',
  cognito_identity_endpoint: '',
  sts_endpoint: '',

  service_base_url: 'https://api.goblin-software.com/',

  service_applist_endpoint: 'cmsdev',
  service_language_endpoint: 'languagedev',
};

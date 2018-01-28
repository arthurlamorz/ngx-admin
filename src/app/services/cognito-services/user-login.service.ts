import {environment} from '../../../environments/environment';
import {Injectable} from '@angular/core';
// import {DynamoDBService} from "./ddb.service";
import {CognitoCallback, CognitoUtil, LoggedInCallback} from './cognito.service';
import {AuthenticationDetails, CognitoUser} from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk/global';
import * as STS from 'aws-sdk/clients/sts';
import { NbAuthResult } from '@nebular/auth';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserLoginService {

    constructor(/*public ddb: DynamoDBService,*/ public cognitoUtil: CognitoUtil) {
    }

    authenticate(username: string, password: string): Observable<NbAuthResult> {
        // console.log("UserLoginService: starting the authentication")

        const authenticationData = {
            Username: username,
            Password: password,
        };
        const authenticationDetails = new AuthenticationDetails(authenticationData);

        const userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool(),
        };

        // console.log("UserLoginService: Params set...Authenticating the user");
        const cognitoUser = new CognitoUser(userData);
        // console.log("UserLoginService: config is " + AWS.config);
        const self = this;

        const observable = new Observable<NbAuthResult>(obs => {

            cognitoUser.authenticateUser(authenticationDetails, {
                newPasswordRequired: function (userAttributes, requiredAttributes) {
                    obs.next( new NbAuthResult (
                        false,
                        null,
                        null,
                        [new Error('User needs to set password.')],
                        ['User needs to set password.'], null))
                },
                onSuccess: function (result) {

                    // console.log("In authenticateUser onSuccess callback");

                    const creds = self.cognitoUtil.buildCognitoCreds(result.getIdToken().getJwtToken());

                    AWS.config.credentials = creds;

                    // So, when CognitoIdentity authenticates a user, it doesn't actually hand us the IdentityID,
                    // used by many of our other handlers. This is handled by some sly underhanded calls to AWS Cognito
                    // API's by the SDK itself, automatically when the first AWS SDK request is made that requires our
                    // security credentials. The identity is then injected directly into the credentials object.
                    // If the first SDK call we make wants to use our IdentityID, we have a
                    // chicken and egg problem on our hands.
                    // We resolve this problem by "priming" the AWS SDK by calling a
                    // very innocuous API call that forces this behavior.
                    const clientParams: any = {};
                    if (environment.sts_endpoint) {
                        clientParams.endpoint = environment.sts_endpoint;
                    }
                    const sts = new STS(clientParams);
                    sts.getCallerIdentity(function (err, data) {
                        // console.log("UserLoginService: Successfully set the AWS credentials");
                        obs.next( new NbAuthResult (true, data, '/', null, null, null))

                    });

                },
                onFailure: function (err) {
                    obs.next( new NbAuthResult (false, err, null, [err], [err.message], null))
                },
            });

        });

        return observable;

    }

    forgotPassword(username: string, callback: CognitoCallback) {
        const userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool(),
        };

        const cognitoUser = new CognitoUser(userData);

        cognitoUser.forgotPassword({
            onSuccess: function () {

            },
            onFailure: function (err) {
                callback.cognitoCallback(err.message, null);
            },
            inputVerificationCode() {
                callback.cognitoCallback(null, null);
            },
        });
    }

    confirmNewPassword(email: string, verificationCode: string, password: string, callback: CognitoCallback) {
        const userData = {
            Username: email,
            Pool: this.cognitoUtil.getUserPool(),
        };

        const cognitoUser = new CognitoUser(userData);

        cognitoUser.confirmPassword(verificationCode, password, {
            onSuccess: function () {
                callback.cognitoCallback(null, null);
            },
            onFailure: function (err) {
                callback.cognitoCallback(err.message, null);
            },
        });
    }

    logout() {
        // console.log("UserLoginService: Logging out");
        // this.ddb.writeLogEntry("logout");
        this.cognitoUtil.getCurrentUser().signOut();

    }

    isAuthenticated(callback: LoggedInCallback) {
        if (callback == null)
            throw(new Error('UserLoginService: Callback in isAuthenticated() cannot be null'));

        const cognitoUser = this.cognitoUtil.getCurrentUser();

        if (cognitoUser != null) {
            cognitoUser.getSession(function (err, session) {
                if (err) {
                    // console.log("UserLoginService: Couldn't get the session: " + err, err.stack);
                    callback.isLoggedIn(err, false);
                } else {
                    // console.log("UserLoginService: Session is " + session.isValid());
                    callback.isLoggedIn(err, session.isValid());
                }
            });
        } else {
            // console.log("UserLoginService: can't retrieve the current user");
            callback.isLoggedIn('Can\'t retrieve the CurrentUser', false);
        }
    }

}

class AuthActions {

    //Signify that we should check for auth credentials
    //If no credentials are provided, we will look for stored credentials
    authenticate(creds) {
        this.dispatch(creds);
        if (creds.method === 'facebook') {
            AuthStore.authenticateFacebook();
        } else if (creds.method === 'google') {
            AuthStore.authenticateGoogle();
        } else if (creds.method === 'twitter') {
            AuthStore.authenticateTwitter();
        } else {
            console.error('Error: Attempted to authenticate via an usupported method.');
        }
    }

    //Signify that we are in the process of authenticating a user
    authenticating() {
        this.dispatch();
    }

    //Signify that we found auth credentials
    //This does not guarentee that the credentials are valid
    wasAuthenticated(data) {
        this.dispatch(data);
    }

    //Signify that we could not successfully validate or find credentials
    authenticationError(error) {
        this.dispatch(error);
    }

    //Invalidate any current sets of credentials
    deauthenticate() {
        this.dispatch();
    }

}

export default alt.createActions(AuthActions);

//For actions we will perform our imports last. If we do this first it tends to create dependency loops. 
import alt from '../alt';
import AuthStore from '../stores/Auth.store';

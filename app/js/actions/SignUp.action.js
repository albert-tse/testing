import alt from '../alt';
import SignUpSource from '../sources/SignUp.source';

class SignUpActions {

    verifyProfileUrl({ url }) {
        // Disect the url into profile's username and platform
        let username = url.match(/[.\-\w]+$/);
        username = Array.isArray(username) && username[0];

        let platform = url.replace(username, '').replace(/https?:\/\/|www\./g, '');

        // Indicate we are now checking if profile is verified/valid
        this.dispatch({url, platform});

        // Fire off a request to check profile username against specified platform
        if (username && platform && /twitter|facebook/.test(platform)) {
            SignUpSource.verifyProfileUrl({ username, platform }).then(result => {
                if (result.data.profile_exists) {
                    this.actions.markProfileUrlVerified(true); // Dispatch an action here when results are in
                } else {
                    console.error('Error: profile_exists was not returned by the API server');
                }
            }).catch(err => this.actions.markProfileUrlVerified(false));
        }
    }

    markProfileUrlVerified(isVerified) {
        this.dispatch(isVerified);
    }
}

export default alt.createActions(SignUpActions);

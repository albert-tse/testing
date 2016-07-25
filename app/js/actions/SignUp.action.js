import alt from '../alt';
import SignUpSource from '../sources/SignUp.source';

class SignUpActions {

    /**
     * Check if the URL to the new user's profile is viewable to the public
     * @param Object payload contains the profile URL
     */
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
                    this.actions.markProfileUrlVerified({ isVerified: true }); // Dispatch an action here when results are in
                } else {
                    console.error('Error: profile_exists was not returned by the API server');
                    this.actions.markProfileUrlVerified({
                        isVerified: false,
                        error: 'We connot verify this profile at the moment.'
                    });
                }
            }).catch(err => this.actions.markProfileUrlVerified({
                isVerified: false,
                error: err
            }));
        } else {
            this.actions.markProfileUrlVerified({
                isVerified: false,
                error: 'Please enter a valid URL to your public profile page. (ie. https://facebook.com/georgehtakei)'
            });
        }
    }

    /**
     * Dispatch this indicating whether or not the given profile url is valid
     * @param Object payload
     */
    markProfileUrlVerified(payload) {
        this.dispatch(payload);
    }
}

export default alt.createActions(SignUpActions);

import alt from '../alt';
import UserAction from '../actions/User.action';
import AuthSource from '../sources/Auth.source';

class UserStore {

    constructor() {
        this.googleUser = {};
        this.bindListeners({
            refreshAuth: UserAction.signIn,
            handleSignOut: UserAction.signOut
        });
    }

    refreshAuth(googleUser) {
        var googleAccessToken = googleUser.getAuthResponse().access_token;

        AuthSource.authenticate(googleAccessToken).then((response) => {
            this.setState({
                googleUser: googleUser,
                serverAccessToken: response.data.token
            });
            console.log('UserStore:refreshAuth - authorized');
            UserAction.authorized(response.data.token);
        });
    }

    handleSignOut() {
        gapi.auth2.getAuthInstance().signOut().then((response) => {
            this.setState({
                googleUser: {}
            });
        });
    }
}

export default alt.createStore(UserStore, 'UserStore');

class UserActions {

    //Signify that we are about to load new user data
    loadUser() {
        this.dispatch();
        UserStore.fetchUser();
    }

    //Signify that we are loading new user data
    loadingUser() {
        this.dispatch();
    }

    //Signify that we have successfully loaded a new user
    loadedUser(userData) {
        this.dispatch(userData);
    }

    //Signify that there was an error fetching user info
    loadUserError() {
        this.dispatch();
    }
}

export default alt.createActions(UserActions);

//For actions we will perform our imports last. If we do this first it tends to create dependency loops. 
import alt from '../alt';
import UserStore from '../stores/User.store';

import alt from '../alt';

class UserAction {
    
    constructor() {
        this.generateActions('signIn', 'signOut', 'authorized');
    }
}

export default alt.createActions(UserAction);

import alt from '../alt';
import AppAction from '../actions/App.action';

class AppStore {

    getInitialState() {
        return {
            userRole: 'default'
        };
    }

    constructor() {
        this.bindListeners({});
    }

}

export default alt.createStore(AppStore, 'AppStore');

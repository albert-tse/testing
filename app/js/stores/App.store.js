import alt from '../alt';
import AppActions from '../actions/App.action';

class AppStore {
    constructor() {
        this.bindActions(AppActions);
    }

    loading() {
        this.showLoading = true;
    }

    loaded() {
        this.showLoading = false;
    }
}

const BaseState = {
    showLoading: false
};

export default alt.createStore(AppStore, 'AppStore');

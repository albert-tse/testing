import alt from '../alt';

class AppActions {

    loading() {
        this.dispatch();
    }

    loaded() {
        this.dispatch();
    }
}

export default alt.createActions(AppActions);

import alt from '../alt';

class AppBarActions {
    pageChanged(pageName) {
        this.dispatch(pageName);
    }

    saveSelected() {
        this.dispatch();
    }

    shareSelected() {
        this.dispatch();
    }
}

export default alt.createActions(AppBarActions);

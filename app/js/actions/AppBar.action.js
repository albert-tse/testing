import alt from '../alt';

class AppBarActions {
    pageChanged(pageName) {
        this.dispatch(pageName);
    }
}

export default alt.createActions(AppBarActions);

import alt from '../alt';
import HeaderActions from '../actions/Header.action';

class HeaderStore {

    constructor() {
        this.bindAction(HeaderActions.setTitle, ::this.setTitle);
        this.title = 'Content Portal';
    }

    setTitle(title) {
        // XXX add validation?
        this.setState({ title: title });
    }
}

export default alt.createStore(HeaderStore, 'HeaderStore');

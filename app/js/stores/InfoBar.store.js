import alt from '../alt';
import InfoBarActions from '../actions/InfoBar.action';

class InfoBarStore {

    constructor() {
        this.bindAction(InfoBarActions.show, this.update);
    }

    /**
     * Replaces the content of the info bar with the new article
     * and stats information passed in the action
     * @param Object content
     */
    update(content) {
        // TODO: add some data validation here before changing the state
        this.setState(content);
    }
}

export default alt.createStore(InfoBarStore, 'InfoBarStore');

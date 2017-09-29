import alt from '../alt';
import PublisherActions from '../actions/Publisher.action';
import PublisherSource from '../sources/Publisher.source';

var BaseState = {};

class PublisherStore {
    constructor() {
        Object.assign(this, BaseState);

        this.registerAsync(PublisherSource);
        this.bindActions(PublisherActions);
        this.exportPublicMethods({});
    }
}

export default alt.createStore(PublisherStore, 'PublisherStore');

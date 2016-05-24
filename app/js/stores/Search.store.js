import alt from '../alt';
import SearchActions from '../actions/Search.action';
import SearchSource from '../sources/Search.source';

const BaseState = {
    results: []
};

class SearchStore {

    constructor() {
        Object.assign(this, BaseState);
        this.registerAsync(SearchSource);
        this.bindActions(SearchActions);
    }

    /**
     * When a new search request is dispatched, reset its state
     */
    onGetResults() {
        this.setState({
            results: []
        });
    }

    /**
     * Process received results from async response
     * @param Object response from server
     */
    onLoaded(response) {
        var { data: { hits } } = response;
        if (typeof hits !== 'undefined') {
            hits.results = hits.hit.map(({ fields: { ucid } }) => ({ ucid: ucid.join() }));
            delete hits.hit;

            this.setState(hits);
        }
    }
}

export default alt.createStore(SearchStore, 'SearchStore');

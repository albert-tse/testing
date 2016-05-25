import alt from '../alt';
import SearchActions from '../actions/Search.action';
import SearchSource from '../sources/Search.source';
import ArticleStore from '../stores/Article.store';
import _ from 'lodash';

const BaseState = {
    total_found: 0,
    cursor: null,
    start: null,
    count: 0,
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
    onLoaded({ data }) { // We're only picking data attribute from the response object
        if (typeof data !== 'undefined') {
            var newState = Object.assign({}, _.pick(data, 'total_found', 'cursor', 'start', 'count'), {
                results: data.articles.map( ({ ucid }) => ({ ucid }) )
            });

            ArticleStore.addArticles(data.articles);
            this.setState(newState);
        }
    }
}

export default alt.createStore(SearchStore, 'SearchStore');

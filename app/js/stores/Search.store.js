import alt from '../alt';
import SearchActions from '../actions/Search.action';
import SearchSource from '../sources/Search.source';
import AppStore from '../stores/App.store';
import AppActions from '../actions/App.action';
import ArticleStore from '../stores/Article.store';
import { concat, defer, pick } from 'lodash';
import uuid from 'uuid-lib';

const BaseState = {
    total_found: 0,
    cursor: null,
    start: 0,
    count: 0,
    isLoadingMore: false,
    loadingGuid: false,
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
     **/
    onGetResults() {
        this.setState(BaseState);
    }

    onLoadMore() {
        this.setState({ isLoadingMore: true, loadingGuid: uuid.raw() });
    }

    /**
     * Process received results from async response
     * @param Object response from server
     */
    onLoaded(payload) {
        var data = payload.data;
        if (typeof data !== 'undefined') {
            var newState;
            if (data.start == 0) {
                //Brand new search, lets reset the state
                newState = Object.assign({}, BaseState, newState, pick(data, 'total_found', 'cursor', 'start', 'count'));
            } else if (this.loadingGuid == payload.loadingGuid) {
                //We loaded more, lets only assign new values
                newState = {
                    cursor: data.cursor,
                    start: data.start,
                    isLoadingMore: false,
                    count: data.count,
                    results: this.results
                };
            } else {
                //In this case we received a loadMore result that we are no longer showing content for. In this case, we do nothing. 
                return;
            }

            newState.results = concat(newState.results, data.articles.map(({ ucid }) => ({ ucid })));

            //Add the new articles to the article store, so that they are cached for later
            ArticleStore.addArticles(data.articles);

            this.setState(newState);
        }
    }
}

export default alt.createStore(SearchStore, 'SearchStore');

//How do I cancel load mores when a new filter set arrives.

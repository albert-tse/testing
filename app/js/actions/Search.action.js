class SearchActions {

    // Call to request for new results
    // This is usually called when a filter changes
    getResults() {
        this.dispatch();
        SearchStore.getResults();
    }

    loadMore() {
        var searchState = SearchStore.getState();
        //Make sure there is more content to load and that we are not currently loading more, before we load more
        if (searchState.total_found != searchState.start && !searchState.isLoadingMore) {
            this.dispatch();
            SearchStore.getResults();
        }
    }

    // Call when server request resolves
    loaded(response) {
        this.dispatch(response);
    }

    // Call when server responds with an error
    error(response) {
        this.dispatch(response);
    }
}

export default alt.createActions(SearchActions);

import alt from '../alt';
import SearchStore from '../stores/Search.store';

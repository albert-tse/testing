class FilterActions {

    // When the sort direction is changed
    sortChanged(sortString) {
        // TODO: BAD BAD legacy code
        if (sortString == 'random') {
            sortString = "_rand_" + parseInt(Math.random() * 10000) + " desc";
        }

        feed.search.sort = sortString;
        // end legacy code

        this.dispatch(sortString);
    }

    /**
     * Update the filters given the new state properties
     * @param Object state to set the store to (ie. { keywords: 'new' })
     * TODO: later on we will need to specify an index/key to determine which page's filter store to update
     */
    update(newState) {
        this.dispatch(newState);
        const filterAttributesThatChanged = Object.keys(newState).join();

        if (/exploreDateRange|sort|trending|relevant|sites/g.test(filterAttributesThatChanged)) {
            SearchActions.getResults();
        }
    }

    trendingChanged(trending) {
        this.dispatch(trending);
    }

    relevantChanged(relevant) {
        this.dispatch(relevant);
    }

    clearSelection() {
        this.dispatch();
    }

    sharePermalink() {
        var link = FilterStore.getLongPermalink();

        FilterStore.shortenArticlePermalink(link);
        this.dispatch();
    }

    shortenedArticlePermalink(shortLink) {
        this.dispatch(shortLink);
    }

    articlePermalinkError(err) {
        this.dispatch(err);
    }
}

export default alt.createActions(FilterActions);

//For actions we will perform our imports last. If we do this first it tends to create dependency loops.
import alt from '../alt';
import FilterStore from '../stores/Filter.store'
import SearchStore from '../stores/Search.store';
import SearchActions from '../actions/Search.action';

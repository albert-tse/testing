import alt from '../alt'
import FilterActions from '../actions/Filter.action'

class FilterStore {
	constructor() {
        this.bindActions(FilterActions);
    }
	  
    trendingChanged (trending) {
        feed.search.trending = trending;

        exploreApp.loadContent(feed.search);
    }

    relevantChanged (relevant) {
        feed.search.relevant = relevant;

        exploreApp.loadContent(feed.search);
    }
}

export default alt.createStore(FilterStore, 'FilterStore');

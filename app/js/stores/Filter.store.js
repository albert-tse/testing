import alt from '../alt'
import FilterActions from '../actions/Filter.action'

class FilterStore {
	constructor() {
        this.bindListeners({
            trendingChanged: FilterActions.TRENDING_CHANGED,
            relevantChanged: FilterActions.RELEVANT_CHANGED
        });
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

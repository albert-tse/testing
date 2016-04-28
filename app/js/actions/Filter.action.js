class FilterActions {

    // When the sort direction is changed
    sortChanged(sortString) {
        console.log('Sort changed', sortString);

        // TODO: BAD BAD legacy code
        if (sortString == 'random') {
            sortString = "_rand_" + parseInt(Math.random() * 10000) + " desc";
        }

        feed.search.sort = sortString;
        // end legacy code

        this.dispatch(sortString);
    }

    dateRangeChanged(startDate, endDate) {
    	console.log(startDate, endDate);
    }
}

export default alt.createActions(FilterActions);

//For actions we will perform our imports last. If we do this first it tends to create dependency loops. 
import alt from '../alt';

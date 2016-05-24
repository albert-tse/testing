import alt from '../alt';
import FilterActions from '../actions/Filter.action';
import moment from 'moment';

const BaseState = {
    date_start: moment().subtract(1, 'month').toDate(), // TODO: change to week
    date_end: new Date(),
    order: 'desc',
    sort: '_rand_' + parseInt(1e4 * Math.random()) + ' desc',
    // partnersId: '', in UserStore
    // siteIds: '', in UserStore
    // timestampStart: null, this is used by shared links
    // timestampEnd: null, this is used by shared links page
    // token: null,
    // user_email: null,
};

class FilterStore {

	constructor() {
        Object.assign(this, BaseState);
        this.bindActions(FilterActions);
    }

}

export default alt.createStore(FilterStore, 'FilterStore');

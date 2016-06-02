import alt from '../alt';
import FilterActions from '../actions/Filter.action';
import moment from 'moment';

const BaseState = {
    date_start: moment().subtract(1, 'month').toDate(), // TODO: change to week
    date_end: new Date(),
    order: 'desc',
    sort: '_rand_' + parseInt(1e4 * Math.random()) + ' desc',
    text: ''
};

class FilterStore {

	constructor() {
        Object.assign(this, BaseState);
        this.bindActions(FilterActions);
    }

    onUpdate(newState) {
        this.setState(newState);
    }

}

export default alt.createStore(FilterStore, 'FilterStore');

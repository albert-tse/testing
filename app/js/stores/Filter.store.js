import alt from '../alt';
import FilterActions from '../actions/Filter.action';
import moment from 'moment';
import ArticleActions from '../actions/Article.action';

const BaseState = {
    date_start: moment().subtract(1, 'month').toDate(), // TODO: change to week
    date_end: new Date(),
    order: 'desc',
    sort: '_rand_' + parseInt(1e4 * Math.random()) + ' desc',
    text: '',
    trending: false,
    relevant: false,
    ucids: []
};

class FilterStore {

	constructor() {
        Object.assign(this, BaseState);
        this.bindActions(FilterActions);
        this.bindListeners({
            addUcid: ArticleActions.selected,
            removeUcid: ArticleActions.deselected
        });
    }

    onUpdate(newState) {
        this.setState(newState);
    }

    onClearSelection() {
        this.setState({ ucids: [] });
    }

    addUcid(ucid) {
        this.setState({
            ucids: [ ...this.ucids.filter(storedUcid => storedUcid !== ucid), ucid ] // This ensures that we have unique ucids
        });
    }

    removeUcid(ucid) {
        this.setState({
            ucids: this.ucids.filter(storedUcid => storedUcid !== ucid)
        });
    }

}

export default alt.createStore(FilterStore, 'FilterStore');

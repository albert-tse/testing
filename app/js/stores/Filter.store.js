import alt from '../alt';
import FilterActions from '../actions/Filter.action';
import moment from 'moment';
import ArticleActions from '../actions/Article.action';
import UserStore from './User.store'
import Config from '../config'

const BaseState = {
    date_start: moment().subtract(1, 'month').toDate(), // TODO: change to week
    date_end: new Date(),
    order: 'desc',
    sort: '_rand_' + parseInt(1e4 * Math.random()) + ' desc',
    text: '',
    trending: false,
    relevant: false,
    ucids: [],
    sites: [],
    platforms: []
};

var hiddenPlatforms = [3, 4, 5, 6, 7, 8];

class FilterStore {

    constructor() {
        Object.assign(this, BaseState);

        this.platforms = _.map(Config.platforms, function (el) {
            if (_.indexOf(hiddenPlatforms, el.id) != -1) {
                return false;
            } else {
                return _.assign(el, {
                    enabled: true
                });
            }
        });
        this.platforms = _.compact(this.platforms);

        console.log(UserStore.getState());
        this.sites = _.filter(UserStore.getState().user.sites, function (el) {
            return el.enabled;
        });

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
            ucids: [...this.ucids.filter(storedUcid => storedUcid !== ucid), ucid] // This ensures that we have unique ucids
        });
    }

    removeUcid(ucid) {
        this.setState({
            ucids: this.ucids.filter(storedUcid => storedUcid !== ucid)
        });
    }

}

export default alt.createStore(FilterStore, 'FilterStore');

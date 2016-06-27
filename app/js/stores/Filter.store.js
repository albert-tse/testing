import alt from '../alt';
import moment from 'moment';
import FilterActions from '../actions/Filter.action';
import ArticleActions from '../actions/Article.action';
import UserStore from './User.store'
import UserActions from '../actions/User.action';
import NotificationStore from './Notification.store';
import Config from '../config'
import History from '../history'
import _ from 'lodash';

const BaseState = {
    date_start: moment().subtract(1, 'month').toDate(), // TODO: change to week
    date_end: moment(new Date()).endOf('day').toDate(),
    order: 'desc',
    sort: 'creation_date desc',
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
        this.sites = _.filter(UserStore.getState().user.sites, el => el.enabled);
        this.bindActions(FilterActions);
        this.bindListeners({
            addUcid: ArticleActions.selected,
            removeUcid: ArticleActions.deselected,
            refreshSites: UserActions.LOADED_USER
        });
    }

    refreshSites() {
        this.waitFor(UserStore);
        this.setState({
            sites: _.filter(UserStore.getState().user.sites, el => el.enabled)
        });
    }

    onUpdate(newState) {
        this.setState(newState);
    }

    onClearSelection() {
        this.setState({ ucids: [] });
    }

    onSharePermalink() {
        var link = Config.contempoUrl + History.createHref(Config.routes.articles).replace(':ids', this.ucids.join());
        _.defer(NotificationStore.add, {
            label: link,
            action: 'copy',
            callback: (evt) => {
                var textField = document.createElement('input');
                document.body.appendChild(textField);
                textField.value = link;
                textField.select();
                document.execCommand('copy');
                document.body.removeChild(textField);
            }
        });
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

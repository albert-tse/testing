import alt from '../alt';
import moment from 'moment';
import FilterActions from '../actions/Filter.action';
import FilterSource from '../sources/Filter.source';
import ArticleActions from '../actions/Article.action';
import UserStore from './User.store'
import UserActions from '../actions/User.action';
import NotificationStore from './Notification.store';
import Config from '../config'
import History from '../history'
import _ from 'lodash';

// exploreDateRange
// analyticsDateRange

const BaseState = {
    date_range_type: 'monthToDate',
    date_start: moment().startOf('month').startOf('day').format(),
    date_end: moment().startOf('day').add(1, 'days').format(),
    exploreDateRange: {
        date_range_type: 'week',
        date_start: moment().startOf('month').startOf('day').format(),
        date_end: moment().startOf('day').add(1, 'days').format()
    },
    analyticsDateRange: {
        date_range_type: 'monthToDate',
        date_start: moment().subtract(1, 'week').startOf('day').format(),
        date_end: moment().startOf('day').add(1, 'days').format()
    },
    order: 'desc',
    sort: 'creation_date desc',
    text: '',
    trending: false,
    relevant: false,
    ucids: [],
    sites: [],
    platforms: [],
    influencers: []
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
        this.influencers = _.filter(UserStore.getState().user.influencers, el => el.enabled);
        
        // Default sort for external influencers should be performance
        if (UserStore.getState().user.role == 'external_influencer') {
            this.sort = 'stat_type_95 desc';
        }    

        this.registerAsync(FilterSource);
        this.bindActions(FilterActions);
        
        this.bindListeners({
            addUcid: ArticleActions.selected,
            removeUcid: ArticleActions.deselected,
            refreshUserData: UserActions.LOADED_USER
        });

        this.exportPublicMethods({
            getLongPermalink: ::this.getLongPermalink
        });
    }

    refreshUserData() {
        this.waitFor(UserStore);
        this.setState({
            sites: _.filter(UserStore.getState().user.sites, el => el.enabled),
            influencers: _.filter(UserStore.getState().user.influencers, el => el.enabled)
        });
    }

    onUpdate(newState) {
        this.setState(newState);
    }

    onClearSelection() {
        this.setState({ ucids: [] });
    }

    getLongPermalink() {
        return Config.contempoUrl + History.createHref(Config.routes.articles).replace(':ids', this.ucids.join());
    }

    onShortenedArticlePermalink(shortlink) {
        _.defer(NotificationStore.add, {
            label: shortlink.data,
            action: 'copy',
            callback: (evt) => {
                var textField = document.createElement('input');
                document.body.appendChild(textField);
                textField.value = shortlink.data;
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

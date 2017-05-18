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

/**
 * Keeps track of all the filters that filter components
 * across the app use
 * @return {Alt.Store}
 */
class FilterStore {

    /**
     * Initialize some of the filters with either default values
     * or get data from other stores that have it
     * @return {FilterStore}
     */
    constructor() {
        Object.assign(this, BaseState);

        this.platforms = _.map(Config.platforms, function (el) {
            if (_.indexOf(Config.hiddenPlatforms, el.id) != -1) {
                return false;
            } else {
                return _.assign(el, {
                    enabled: true
                });
            }
        });

        this.platforms = _.compact(this.platforms);
        this.sites = _.filter(UserStore.getState().user.sites, el => el.enabled);

        // Default sort for external influencers should be performance
        if (UserStore.getState().user.role == 'external_influencer') {
            this.sort = 'stat_type_95 desc';
        }

        _.defer(this.refreshUserData); // Wait until this store is instantiated before setting user data

        this.registerAsync(FilterSource);
        this.bindActions(FilterActions);

        this.bindListeners({
            addUcid: ArticleActions.selected,
            removeUcid: ArticleActions.deselected,
            refreshUserData: UserActions.LOADED_USER,
            onChangeSelectedInfluencer: UserActions.CHANGE_SELECTED_INFLUENCER
        });

        this.exportPublicMethods({
            getLongPermalink: ::this.getLongPermalink
        });
    }

    /**
     * Update this store with new values from UserStore
     * This is called whenever user is loaded or the page is refreshed
     */
    refreshUserData = () => {
        const { user } = UserStore.getState();
        const influencers = _.filter(user.influencers, this._isEnabled);
        const sites = _.filter(user.sites, this._isEnabled);
        let newState = { influencers, sites };

        // Select a default influencer if none have been selected
        if (influencers.length > 0 && this.selectedInfluencer.id < 0) {
            newState = { ...newState, selectedInfluencer: influencers[0] };
        }

        this.setState(newState);
    }

    onUpdate(newState) {
        this.setState(newState);
    }

    onToggleSelectionMode() {
        this.setState({ ucids: [] });
    }

    onClearSelection() {
        this.setState({ ucids: null });
    }

    getLongPermalink() {
        return Config.contempoUrl + History.createHref(Config.routes.articles).replace(':ids', this.ucids.join());
    }

    onChangeSelectedInfluencer(influencer) {
        var influencers = _.map(this.influencers, function(el){
            el = _.clone(el);
            el.enabled = el.id == influencer;
            return el;
        });

        this.setState({
            influencers: influencers
        });
    }

    onShortenedArticlePermalink(shortlink) {
        this.setState({
            permalink: {
                stories: this.ucids.length,
                shortened: shortlink.data
            }
        });
    }

    onCopyPermalink() {
        let textField = document.createElement('input');
        document.body.appendChild(textField);
        textField.value = this.permalink.shortened;
        textField.select();
        document.execCommand('copy');
        document.body.removeChild(textField);
        this.setState({
            ucids: null,
            permalink: BaseState.permalink
        });

        _.defer(NotificationStore.add, 'Success! Permalink saved.');
    }

    addUcid(ucid) {
        this.setState({
            ucids: Array.isArray(this.ucids) ? [...this.ucids.filter(storedUcid => storedUcid !== ucid), ucid] : [ ucid ] // This ensures that we have unique ucids
        });
    }

    removeUcid(ucid) {
        this.setState({
            ucids: this.ucids.length === 1 ? null : this.ucids.filter(storedUcid => storedUcid !== ucid)
        });
    }

    reset() {
        this.setState({
            ...(_.pick(BaseState, 'exploreDateRange', 'sort', 'text', 'trending', 'relevant')),
            sites: this.sites.map(site => Object.assign({}, site, { enabled: true }))
        });
    }

    /**
     * Checks if passed object is enabled
     * @param {object} obj an object that has a property "enabled"
     * @param {boolean} obj.enabled determins if it is or isn't
     * @return {boolean}
     */
    _isEnabled({ enabled }) {
        return Boolean(enabled);
    }

}

/**
 * @type {object} contains initial or default values for all filters the app uses
 */
const BaseState = {
    analyticsDateRange: {
        date_range_type: 'monthToDate',
        date_start: moment().startOf('month').startOf('day').format(),
        date_end: moment().startOf('day').add(1, 'days').format()
    },
    calendarQueueWeek: 1,
    date_end: moment().startOf('day').add(1, 'days').format(),
    date_range_type: 'monthToDate',
    date_start: moment().startOf('month').startOf('day').format(),
    exploreDateRange: {
        date_range_type: 'week',
        date_start: moment().subtract(1, 'week').startOf('day').format(),
        date_end: moment().startOf('day').add(1, 'days').format()
    },
    influencers: [],
    linksDateRange: {
        date_range_type: 'thisWeek',
        date_start: moment().startOf('week').format(),
        date_end: moment().endOf('week').format()
    },
    linksPageNumber: 0,
    linksPageSize: 50,
    order: 'desc',
    permalink: {
        stories: 0,
        shortened: ''
    },
    platforms: [],
    relevant: false,
    selectedAccountingMonth: 0,
    selectedLinkState: 'all',
    selectedInfluencer: { id: -1 },
    sites: [],
    sort: 'creation_date desc',
    text: '',
    trending: false,
    ucids: null,
    used_sites: [],
};

export default alt.createStore(FilterStore, 'FilterStore');

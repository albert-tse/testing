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
        date_start: moment().subtract(1, 'week').startOf('day').format(),
        date_end: moment().startOf('day').add(1, 'days').format()
    },
    analyticsDateRange: {
        date_range_type: 'monthToDate',
        date_start: moment().startOf('month').startOf('day').format(),
        date_end: moment().startOf('day').add(1, 'days').format()
    },
    linksDateRange: {
        date_range_type: 'thisWeek',
        date_start: moment().startOf('week').format(),
        date_end: moment().endOf('week').format()
    },
    selectedAccountingMonth: 0,
    selectedLinkState: 'all',
    order: 'desc',
    sort: 'creation_date desc',
    text: '',
    trending: false,
    relevant: false,
    permalink: {
        stories: 0,
        shortened: ''
    },
    ucids: null,
    used_sites: [],
    sites: [],
    platforms: [],
    influencers: [],
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
        
        this.influencers = _.map(this.influencers, function(el){
            el = _.clone(el);
            el.enabled = el.id == UserStore.getState().selectedInfluencer.id;
            return el;
        });

        // Default sort for external influencers should be performance
        if (UserStore.getState().user.role == 'external_influencer') {
            this.sort = 'stat_type_95 desc';
        }    

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

    refreshUserData() {
        this.waitFor(UserStore);
        var influencers = _.filter(UserStore.getState().user.influencers, el => el.enabled);

        influencers = _.map(influencers, function(el){
            el = _.clone(el);
            el.enabled = el.id == UserStore.getState().selectedInfluencer.id;
            return el;
        });

        this.setState({
            sites: _.filter(UserStore.getState().user.sites, el => el.enabled),
            influencers: influencers
        });
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

}

export default alt.createStore(FilterStore, 'FilterStore');

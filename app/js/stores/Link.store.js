import alt from '../alt';
import LinkActions from '../actions/Link.action';

import LinkSource from '../sources/Link.source';
import ListStore from '../stores/List.store';
import NotificationStore from '../stores/Notification.store';
import ArticleStore from '../stores/Article.store';
import UserStore from '../stores/User.store';
import ProfileStore from '../stores/Profile.store';

import NotificationActions from '../actions/Notification.action';
import ShareDialogActions from '../actions/ShareDialog.action';
import Config from '../config/';
import { chain, defer, find, isEmpty } from 'lodash';
import History from '../history';

const BaseState = {
    searchResults: []
};

class LinkStore {
    constructor() {
        Object.assign(this, BaseState);
        this.registerAsync(LinkSource);
        this.bindActions(LinkActions);
        this.exportPublicMethods({
            deschedule: this.deschedule.bind(this)
        });
    }

    onFetchedLinks(links) {
        const hydratedLinks = links.map(this._hydrateWithReferencedData, {
            influencers: UserStore.getState().user.influencers,
            profiles: ProfileStore.getState().profiles,
            siteBudgetPercents: UserStore.getSiteBudgetPercents()
        });

        this.setState({
            isLoading: false,
            searchResults: hydratedLinks
        });
    }

    onGeneratedLink(payload) {
        payload = { ...payload, article: ArticleStore.getState().articles[payload.link.ucid] };
        defer(ShareDialogActions.open, payload);
    }

    onGenerateLinkError() {
        defer(NotificationStore.add, 'There was an error generating your link. Please try again.');
    }

    onGeneratedMultipleLinks(payload) {
        defer(NotificationStore.add, {
            label: payload.length + ' links have been generated.',
            action: 'Go to My Links',
            callback: History.push.bind(this, Config.routes.links)
        });
    }

    onLoading() {
        this.setState({
            isLoading: true,
            searchResults: -1 // flags that it is loading instead of an empty array which means no links found
        });
    }

    /**
     * Remove a scheduled post given a postId
     * @param {int} postId to remove
     */
    deschedule(postId) {
        this.setState({
            searchResults: this.searchResults.filter(post => post.scheduledPostId !== postId)
        }, this.getInstance().fetchLinks);
    }

    /**
     * Hydrate a given link with data it refers to
     * ie. hydrate it with influencer data given link.influencer_id
     * @param {object} link that will by hydrated
     * @context {object} this provides data a link needs to hydrate with
     * @return {object}
     */
    _hydrateWithReferencedData(link) {
        const { influencers, profiles, siteBudgetPercents } = this;
        const influencerAvatar = chain(influencers)
            .find({ id: link.influencerId })
            .result('fb_profile_image', null)
            .value();

        const profileName = chain(profiles)
            .find({ id: link.profileId })
            .result('profile_name', null)
            .value();

        return {
            ...link,
            capPercentage: siteBudgetPercents[link.siteId],
            influencerAvatar,
            profileName
        };
    }

}

const intentUrls = {
    twitter: 'https://twitter.com/intent/tweet?url=',
    facebook: 'https://www.facebook.com/sharer/sharer.php?u='
};

export default alt.createStore(LinkStore, 'LinkStore');

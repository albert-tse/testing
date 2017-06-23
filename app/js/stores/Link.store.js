import { chain, defer, find, isEmpty } from 'lodash';

import alt from '../alt';
import Config from '../config/';
import History from '../history';

import ArticleStore from '../stores/Article.store';
import LinkSource from '../sources/Link.source';
import ListStore from '../stores/List.store';
import NotificationStore from '../stores/Notification.store';
import ProfileStore from '../stores/Profile.store';
import UserStore from '../stores/User.store';

import FilterActions from '../actions/Filter.action';
import LinkActions from '../actions/Link.action';
import NotificationActions from '../actions/Notification.action';
import ProfileActions from '../actions/Profile.action';
import ShareDialogActions from '../actions/ShareDialog.action';
import UserActions from '../actions/User.action';

const BaseState = {
    links: []
};

class LinkStore {
    constructor() {
        Object.assign(this, BaseState);
        this.registerAsync(LinkSource);
        this.bindActions(LinkActions);
        this.bindListeners({
            onFiltersUpdated: FilterActions.update,
            onUserUpdated: [UserActions.loadedUser, ProfileActions.loadedProfiles]
        });
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
            links: hydratedLinks
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
            links: -1 // flags that it is loading instead of an empty array which means no links found
        });
    }

    /**
     * Listen to specific changes in filters
     * Example: when selectedInfluencer changes, fetch links for that
     * @param {object} changes whose keys determine which of the filters updated
     */
    onFiltersUpdated(changes) {
        if ('selectedInfluencer' in changes || 'linksDateRange' in changes || 'linksPageNumber' in changes) {
            defer(this.getInstance().fetchLinks);
        }
    }

    /**
     * Check new user state and see if the links should be updated as well
     */
    onUserUpdated() {
        this.waitFor([ProfileStore, UserStore]);
        const { hasConnectedProfiles } = UserStore.getState();

        this.setState({
            showEnableSchedulingCTA: !hasConnectedProfiles
        });
    }

    /**
     * Remove a scheduled post given a postId
     * @param {int} postId to remove
     * TODO: this is broken because we haven't updated LinkSource.fetchLinks for Queue view
     */
    deschedule(postId) {
        this.setState({
            links: this.links.filter(post => post.scheduledPostId !== postId)
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

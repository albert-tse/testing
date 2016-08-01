import alt from '../alt';
import InfluencerActions from '../actions/Influencer.action';
import InfluencerSource from '../sources/Influencer.source';
import Config from '../config/';
import reduce from 'lodash/reduce';

var BaseState = {
    searchedClickTotals: [],
    searchedLinkTotals: [], 
    searchSummary: null,
    testInfluencers: {
        isLoading: false,
        isLoaded: false,
        influencers: [],
        error: false
    }
}

class InfluencerStore {
    constructor() {
        Object.assign(this, BaseState);

        this.registerAsync(InfluencerSource);
        this.bindActions(InfluencerActions);
        this.exportPublicMethods({});
    }

    searchClicks() {
        this.setState({
            searchedClickTotals: []
        });
    }

    searchedClicks(clicks) {
        this.setState({
            searchedClickTotals: clicks.data
        });
    }

    searchClicksError() {
        // TODO
    }

    searchLinks() {
        this.setState({
            searchedLinkTotals: [],
        });
    }

    searchedLinks(links) {
        const estimatedRevenue = links.data.estimatedRevenue;
        const totalPosts = links.data.links ? links.data.links.length : 0;
        const averageRevenuePerPost = estimatedRevenue / totalPosts;

        links.data.links = links.data.links.map(link => Object.assign({}, link, {
            ctr: link.ctr || 0,
            fb_permalink: typeof link.fb_permalink === 'string' ? link.fb_permalink : '',
            fb_reach: link.fb_reach || 0,
            shared_date: typeof(link.shared_date) === 'string' ? new Date(link.shared_date).getTime() : 0,
        }));

        this.setState({
            searchedLinkTotals: links.data,
            searchSummary: Object.assign({}, this.searchSummary, {
                estimatedRevenue: estimatedRevenue,
                totalPosts: totalPosts,
                averageRevenuePerPost: averageRevenuePerPost,
                projectedRevenue: 0
            })
        });
    }

    searchLinksError() {
        // TODO
    }
}

export default alt.createStore(InfluencerStore, 'InfluencerStore');

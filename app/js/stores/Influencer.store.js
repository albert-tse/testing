import alt from '../alt';
import InfluencerActions from '../actions/Influencer.action';
import InfluencerSource from '../sources/Influencer.source';
import Config from '../config/';
import reduce from 'lodash/reduce';

var BaseState = {
    searchedClickTotals: [],
    searchedLinkTotals: [],
    searchSummary: null,
    projectedRevenue: 0,
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

        const totalClicks = _.reduce(links.data.links, (total, link) => {
            return total + link.total_clicks;
        }, 0);

        const totalReach = _.reduce(links.data.links, (total, link) => {
            return total + link.fb_reach;
        }, 0);

        const averageClicksPerPost = totalClicks / totalPosts;

        links.data.links = links.data.links.map(link => Object.assign({}, link, {
            ctr: link.ctr || 0,
            fb_permalink: typeof link.fb_permalink === 'string' ? link.fb_permalink : '',
            fb_reach: link.fb_reach || 0,
            shared_date: typeof (link.shared_date) === 'string' ? new Date(link.shared_date).getTime() : 0,
        }));

        let averageCtr = 0;

        if (totalPosts > 0) {
            let totalCtr = _.reduce(links.data.links, (total, link) => {
                return total + link.ctr;
            }, 0);

            averageCtr = totalCtr / totalPosts;
        }

        let averageReach = 0;

        if (totalPosts > 0) {
            averageReach = totalReach / totalPosts;
        }

        let postsPerDay = totalPosts;
        let clicksPerDay = totalClicks;
        let reachPerDay = totalReach;

        if (links.data.queriedDays > 0) {
            postsPerDay = totalPosts / links.data.queriedDays;
            clicksPerDay = totalClicks / links.data.queriedDays;
            reachPerDay = totalReach / links.data.queriedDays;
        }

        this.setState({
            searchedLinkTotals: links.data,
            searchSummary: Object.assign({}, this.searchSummary, {
                estimatedRevenue: estimatedRevenue,
                totalPosts: totalPosts,
                averageRevenuePerPost: averageRevenuePerPost,
                totalClicks: totalClicks,
                averageClicksPerPost: averageClicksPerPost,
                averageCtrPerPost: averageCtr,
                averageReachPerPost: averageReach,
                postsPerDay: postsPerDay,
                clicksPerDay: clicksPerDay,
                reachPerDay: reachPerDay
            })
        });
    }

    searchLinksError() {
        // TODO
    }

    gotProjectedRevenue(payload) {
        this.setState({
            projectedRevenue: payload.data.data.projectedRevenue
        });
    }
}

export default alt.createStore(InfluencerStore, 'InfluencerStore');

import alt from '../alt';
import InfluencerActions from '../actions/Influencer.action';
import InfluencerSource from '../sources/Influencer.source';
import UserStore from '../stores/User.store';
import Config from '../config/';
import { find, reduce } from 'lodash';

var BaseState = {
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
    
    searchLinks() {
        this.setState({
            searchedLinkTotals: [],
        });
    }

    searchedLinks(links) {

        // Map default values for FB social data
        links.data.links = links.data.links.map(link => Object.assign({}, link, {
            ctr: link.ctr || 0,
            fb_permalink: typeof link.fb_permalink === 'string' ? link.fb_permalink : '',
            fb_reach: link.fb_reach || 0,
            shared_date: typeof (link.shared_date) === 'string' ? new Date(link.shared_date).getTime() : 0,
        }));

        const estimatedRevenue = links.data.estimatedRevenue;
        const totalPosts = links.data.links ? links.data.links.length : 0;
        const totalClicks = _.reduce(links.data.links, (total, link) => {
            return total + link.total_clicks;
        }, 0);

        const totalReach = _.reduce(links.data.links, (total, link) => {
            return total + link.fb_reach;
        }, 0);


        // Calculate per post averages
        let averageRevenuePerPost = 0;
        let averageClicksPerPost = 0;
        let averageCtrPerPost = 0;
        let averageReachPerPost = 0;

        if (totalPosts > 0) {
            averageClicksPerPost = totalClicks / totalPosts;

             let totalCtr = _.reduce(links.data.links, (total, link) => {
                return total + link.ctr;
            }, 0);

            averageCtrPerPost = totalCtr / totalPosts;
            averageRevenuePerPost = estimatedRevenue / totalPosts;
            averageReachPerPost = totalReach / totalPosts;
        }

        // Calculate per day averages
        let postsPerDay = totalPosts;
        let clicksPerDay = totalClicks;
        let reachPerDay = totalReach;

        if (links.data.queriedDays > 0) {
            postsPerDay = totalPosts / links.data.queriedDays;
            clicksPerDay = totalClicks / links.data.queriedDays;
            reachPerDay = totalReach / links.data.queriedDays;
        }

        const influencers = UserStore.getState().user.influencers;
        const platforms = Config.platforms;
        links.data.links = links.data.links.map(link => Object.assign({}, link, {
            influencer: find(influencers, { id: link.partner_id }) || 'Unknown',
            platform: platforms[link.platform_id] || 'Unknown'
        }));

        let newState = {
            searchedLinkTotals: links.data,
            searchSummary: Object.assign({}, this.searchSummary, {
                estimatedRevenue: estimatedRevenue,
                totalPosts: totalPosts,
                averageRevenuePerPost: averageRevenuePerPost,
                totalClicks: totalClicks,
                averageClicksPerPost: averageClicksPerPost,
                averageCtrPerPost: averageCtrPerPost,
                averageReachPerPost: averageReachPerPost,
                postsPerDay: postsPerDay,
                clicksPerDay: clicksPerDay,
                reachPerDay: reachPerDay
            }
        )};

        this.setState(newState);
    }

    searchLinksError(error) {
        // TODO
        console.log('searchLinksError', error, error.stack);
    }

    gotProjectedRevenue(payload) {
        this.setState({
            projectedRevenue: payload.data.data.projectedRevenue
        });
    }

    projectedRevenueError(error) {
        console.log('projectedRevenueError', error, error.stack);
    }
}

export default alt.createStore(InfluencerStore, 'InfluencerStore');

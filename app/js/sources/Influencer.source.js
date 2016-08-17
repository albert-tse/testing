import AuthStore from '../stores/Auth.store';
import UserStore from '../stores/User.store';
import FilterStore from '../stores/Filter.store';
import InfluencerActions from '../actions/Influencer.action';
import AppActions from '../actions/App.action';
import Config from '../config';
import API from '../api.js';

const InfluencerSource = {
    searchClicks() {
        return {
            remote(state) {
                var userState = UserStore.getState();
                var { token } = AuthStore.getState();
                var filters = FilterStore.getState().analyticsDateRange;

                var payload = {
                    token: token,
                    timestamp_start: '' + filters.date_start,
                    timestamp_end: '' + filters.date_end,
                    influencer_id: userState.selectedInfluencer.id
                };

                return API.get(`${Config.apiUrl}/influencers/get_daily_clicks`, {
                    params: payload
                });
            },

            success: InfluencerActions.searchedClicks,
            error: InfluencerActions.searchClicksError
        }
    },

    searchLinks() {
        return {
            remote(state) {
                var userState = UserStore.getState();
                var { token } = AuthStore.getState();
                var filters = FilterStore.getState().analyticsDateRange;

                var payload = {
                    token: token,
                    timestamp_start: '' + filters.date_start,
                    timestamp_end: '' + filters.date_end,
                    influencer_id: userState.selectedInfluencer.id
                };

                return API.get(`${Config.apiUrl}/influencers/get_mtd_total_links_shared`, {
                    params: payload
                });
            },

            success: InfluencerActions.searchedLinks,
            loading: AppActions.loading,
            error: InfluencerActions.searchLinksError
        }
    },

    projectedRevenue() {
        return {
            remote(state, influencers) {
                var userState = UserStore.getState();
                var { token } = AuthStore.getState();

                var payload = {
                    token: token,
                    influencers: influencers ? influencers : userState.selectedInfluencer.id
                };

                return API.get(`${Config.apiUrl}/influencers/projected-revenue`, {
                    params: payload
                });
            },

            success: InfluencerActions.gotProjectedRevenue,
            error: InfluencerActions.projectedRevenueError
        }
    },

    getMonthlyPayout() {
        return {
            remote(state, influencers, monthOffset) {
                const params = {
                    token: AuthStore.getState().token,
                    influencers: influencers,
                    monthOffset: monthOffset
                };

                return API.get(`${Config.apiUrl}/influencers/payment-report`, { params });
            },

            success: AppActions.loaded,
            loading: AppActions.loading,
            error: InfluencerActions.monthlyPayoutError,
        }
    }

};

export default InfluencerSource;

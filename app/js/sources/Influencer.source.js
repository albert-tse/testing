import AuthStore from '../stores/Auth.store';
import UserStore from '../stores/User.store';
import FilterStore from '../stores/Filter.store';
import InfluencerActions from '../actions/Influencer.action';
import AppActions from '../actions/App.action';
import Config from '../config';
import API from '../api.js';
import moment from 'moment';

const InfluencerSource = {
    
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
                    month: monthOffset,
                };

                return API.get(`${Config.apiUrl}/influencers/payment-report`, { params });
            },

            downloadLink(influencers, monthOffset) {
                const params = [
                    'token=' + AuthStore.getState().token,
                    'influencers=' + influencers,
                    'month=' + monthOffset
                ];

                return `${Config.apiUrl}/influencers/payment-report?type=csv&${params.join('&')}`;
            },

            success: AppActions.loaded,
            loading: AppActions.loading,
            error: InfluencerActions.monthlyPayoutError,
        }
    },

    getCpcs() {
        return {
            remote(state, influencerId) {

                var { token } = AuthStore.getState();

                return API.get(`${Config.apiUrl}/influencers/${influencerId}/site-cpcs?token=${token}`);
            },

            success: InfluencerActions.gotCpcs,
            error: InfluencerActions.getCpcsError
        }
    },

    getDailyClicks() {
        return {
            remote(state, influencerId, monthOffset) {

                var { token } = AuthStore.getState();

                var DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";
                var start = moment().subtract(monthOffset, 'months').startOf('month').format(DATE_FORMAT);
                var end = moment().subtract(monthOffset, 'months').endOf('month').format(DATE_FORMAT);

                return API.get(`${Config.apiUrl}/influencers/${influencerId}/clicks-per-day?token=${token}&start=${start}&end=${end}`);
            },

            success: InfluencerActions.gotDailyClicks,
            error: InfluencerActions.getDailyClicksError
        }
    },

    getGlobalDailyClicks() {
        return {
            remote(state, monthOffset) {

                var { token } = AuthStore.getState();

                var DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";
                var start = moment().subtract(monthOffset, 'months').startOf('month').format(DATE_FORMAT);
                var end = moment().subtract(monthOffset, 'months').endOf('month').format(DATE_FORMAT);

                return API.get(`${Config.apiUrl}/influencers/clicks-per-day?token=${token}&start=${start}&end=${end}`);
            },

            success: InfluencerActions.gotGlobalDailyClicks,
            error: InfluencerActions.getGlobalDailyClicksError
        }
    }

};

export default InfluencerSource;

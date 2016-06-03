import axios from 'axios';
import AuthStore from '../stores/Auth.store';
import UserStore from '../stores/User.store';
import FilterStore from '../stores/Filter.store';
import InfluencerActions from '../actions/Influencer.action';
import Config from '../config';

const InfluencerSource = {

    searchClicks() {
        return {
            remote(state) {
                return new Promise((resolve, reject) => {
                    var userState = UserStore.getState();
                    var { token } = AuthStore.getState();

                    var payload = {
                        token: token,
                        timestamp_start: 'Tue Mar 01 2016 00:00:00 GMT-0500 (EST)',
                        timestamp_end: 'Thur Mar 31 2016 00:00:00 GMT-0500 (EST)',
                        influencer_id: userState.selectedInfluencer.id
                    };

                    return axios.get(`${Config.apiUrl}/influencers/get_daily_clicks`, {
                        params: payload
                    }).then(resolve).catch(reject);
                });
            },

            success: InfluencerActions.searchedClicks,
            error: InfluencerActions.searchClicksError
        }
    },

    searchLinks() {
        return {
            remote(state) {
                return new Promise((resolve, reject) => {
                    var userState = UserStore.getState();
                    var { token } = AuthStore.getState();

                    var payload = {
                        token: token,
                        timestamp_start: 'Tue Mar 01 2016 00:00:00 GMT-0500 (EST)',
                        timestamp_end: 'Thur Mar 31 2016 00:00:00 GMT-0500 (EST)',
                        influencer_id: userState.selectedInfluencer.id
                    };

                    return axios.get(`${Config.apiUrl}/influencers/get_mtd_total_links_shared`, {
                        params: payload
                    }).then(resolve).catch(reject);
                });
            },

            success: InfluencerActions.searchedLinks,
            error: InfluencerActions.searchLinksError
        }
    }

};

export default InfluencerSource;

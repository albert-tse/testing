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
                    console.log(userState.selectedInfluencer.id);
                    var payload =
                        /*Object.assign(FilterStore.getState(),*/
                        {
                            //user_email: userState.user.email,
                            //partners_id: userState.user.influencers.map(inf => inf.id).join(),
                            //site_ids: userState.selectedSites.join(),
                            token: token,
                            timestamp_start: 'Tue Mar 01 2016 00:00:00 GMT-0500 (EST)',
                            timestamp_end: 'Thur Mar 31 2016 00:00:00 GMT-0500 (EST)',
                            influencer_id: userState.selectedInfluencer.id
                                //skipDate: false
                        };
                    //&timestamp_start=Tue+Mar+01+2016+00%3A00%3A00+GMT-0500+(EST)&timestamp_end=Thu+Mar+31+2016+00%3A00%3A00+GMT-0400+(EDT)&influencer_id=4
                    return axios.get(`${Config.apiUrl}/influencers/get_daily_clicks`, {
                        params: payload
                    }).then(resolve).catch(reject);
                });
            },

            success: InfluencerActions.searchedClicks,
            error: InfluencerActions.searchClicksError
        }
    }

};

export default InfluencerSource;

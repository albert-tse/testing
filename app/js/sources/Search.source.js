import axios from 'axios';
import AuthStore from '../stores/Auth.store';
import UserStore from '../stores/User.store';
import FilterStore from '../stores/Filter.store';
import SearchActions from '../actions/Search.action';
import Config from '../config';

const SearchSource = {

    getResults() {
        return {
            remote(state, options) {
                return new Promise((resolve, reject) => {
                    var userState = UserStore.getState();
                    var { token } = AuthStore.getState();
                    var site_ids = _.map(FilterStore.getState().sites, 'id').join();
                    var payload = Object.assign(FilterStore.getState(), {
                        user_email: userState.user.email,
                        partners_id: userState.user.influencers.map(inf => inf.id).join(),
                        site_ids: site_ids,
                        token: token,
                        skipDate: false
                    });

                    delete payload.ucids;
                    delete payload.sites;
                    delete payload.platforms;

                    if (options) {
                        // Filter by UCID
                        if ('filterByUcid' in options && options.filterByUcid) {
                            payload.ucids = payload.ucids.filter(Boolean).join();
                            payload.skipDate = true;
                        }
                    }

                    return axios.get(`${Config.apiUrl}/articles/search-beta`, {
                        params: payload
                    }).then(resolve).catch(reject);
                });
            },

            success: SearchActions.loaded,
            error: SearchActions.error
        }
    }

};

export default SearchSource;

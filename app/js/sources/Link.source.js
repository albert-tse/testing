import axios from 'axios';
import AuthStore from '../stores/Auth.store';
import UserStore from '../stores/User.store';
import FilterStore from '../stores/Filter.store';
import LinkActions from '../actions/Link.action';
import Config from '../config';

const LinkSource = {

    generateLink() {
        return {
            remote(state) {
                return new Promise((resolve, reject) => {
                    var userState = UserStore.getState();
                    var { token } = AuthStore.getState();
                    var payload = Object.assign(FilterStore.getState(), {
                        //user_email: userState.user.email,
                        //partners_id: userState.user.influencers.map(inf => inf.id).join(),
                        //site_ids: userState.selectedSites.join(),
                        token: token,
                        //skipDate: false
                    });

                    return axios.get(`${Config.apiUrl}/articles/search-beta`, {
                        params: payload
                    }).then(resolve).catch(reject);
                });
            },

            success: LinkActions.searched,
            error: LinkActions.searchError
        }
    }

};

export default LinkSource;

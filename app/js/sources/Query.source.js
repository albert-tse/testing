import AuthStore from '../stores/Auth.store';
import FilterStore from '../stores/Filter.store';
import Config from '../config';
import API from '../api.js';

const SearchSource = {

    runQuery() {
        return {
            remote(state, query) {
                var { token } = AuthStore.getState();
                return API.post(`${Config.apiUrl}/query/?token=${token}`, query);
            }
        }
    }

};

const enabledOnly = site => site.enabled;

export default SearchSource;

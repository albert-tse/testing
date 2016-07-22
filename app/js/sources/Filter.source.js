import AuthStore from '../stores/Auth.store';
import FilterActions from '../actions/Filter.action'
import Config from '../config';
import API from '../api.js';

var FilterSource = {
    shortenArticlePermalink() {
        return {
            remote(state, link) {
            	var { token } = AuthStore.getState();

            	var payload = {
            		token: token,
                    url: link
                };

                return API.get(`${Config.apiUrl}/links/tinyurl`, {
                    params: payload
                });
            },

            success: FilterActions.shortenedArticlePermalink,
            error: FilterActions.articlePermalinkError
        }
    },
};

export default FilterSource;

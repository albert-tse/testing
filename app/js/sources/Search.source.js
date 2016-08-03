import AuthStore from '../stores/Auth.store';
import FilterStore from '../stores/Filter.store';
import AppActions from '../actions/App.action';
import SearchActions from '../actions/Search.action';
import Config from '../config';
import API from '../api.js';

const SearchSource = {

    getResults() {
        return {
            remote(state, options) {
                var guid = state.loadingGuid;
                var { token } = AuthStore.getState();

                var site_ids = _.map(FilterStore.getState().sites.filter(enabledOnly), 'id').join();

                var {date_start, date_end, order, sort, text, trending, relevant, ucids} = FilterStore.getState();

                var payload = {
                    date_start: date_start, 
                    date_end: date_end, 
                    order: order, 
                    sort: sort, 
                    text: text, 
                    trending: trending, 
                    relevant: relevant, 
                    ucids: ucids,
                    site_ids: site_ids,
                    token: token,
                    skipDate: false
                };

                if (state.cursor) {
                    payload.cursor = state.cursor;
                }

                if (options) {
                    // Filter by UCID
                    if ('filterByUcid' in options && options.filterByUcid) {
                        payload.ucids = payload.ucids.filter(Boolean).join();
                        payload.skipDate = true;
                    }
                }

                return API.get(`${Config.apiUrl}/articles/search-beta`, {
                    params: payload
                }).then(function (data) {
                    data.loadingGuid = guid;
                    return Promise.resolve(data);
                });
            },

            success: SearchActions.loaded,
            loading: AppActions.loading,
            error: SearchActions.error
        }
    }

};

const enabledOnly = site => site.enabled;

export default SearchSource;

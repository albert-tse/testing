import moment from 'moment';
import AuthStore from '../stores/Auth.store';
import UserStore from '../stores/User.store';
import ArticleStore from '../stores/Article.store';
import FilterStore from '../stores/Filter.store';
import LinkActions from '../actions/Link.action';
import Config from '../config';
import API from '../api.js';

const LinkSource = {

    generateLink() {
        return {
            remote(state, { ucid, platform }) {
                return generateRequest(generatePayload(ucid)).then(payload => {
                    if (typeof platform !== 'undefined') {
                        payload = Object.assign(payload, { platform: platform });
                    }
                    return payload;
                });
            },

            success: LinkActions.generatedLink,
            error: LinkActions.generatedLinkError
        }
    },

    generateMultipleLinks() {
        return {
            remote(state) {
                var ucids = FilterStore.getState().ucids;
                var payloads = ucids.map(generatePayload).map(generateRequest);
                return Promise.all(payloads);
            },

            success: LinkActions.generatedMultipleLinks,
            error: LinkActions.generatedLinkError
        };
    },

    fetchLinks() {
        return {
            remote(state) {
                var { token } = AuthStore.getState();
                var userState = UserStore.getState();
                var filters = FilterStore.getState();

                let selectedInfluencers = filters.influencers.filter(item => item.enabled);


                var payload = {
                    token: token,
                    influencers: selectedInfluencers.map(item => item.id).join(','),
                    sites: _.map(filters.sites, 'id').join(','),
                    startDate: moment(filters.linksDateRange.date_start).format(),
                    endDate: moment(filters.linksDateRange.date_end).format()
                };

                switch (filters.selectedLinkState) {
                    case 'posted':
                        payload.posted = 1;
                        break;
                    case 'scheduled':
                        payload.scheduled = 1;
                        break;
                    case 'saved': 
                        payload.saved = 1;
                        break;
                }

                return API.get(`${Config.apiUrl}/links/search`, { params: payload })
                    .then(function (payload) {
                        var data = payload.data.data;

                        data = _.map(data, function (el) {
                            el.shortUrl = el.shortUrl.replace('po.st', 'qklnk.co');
                            return el;
                        });
                        return Promise.resolve(data);
                    });
            },

            success: LinkActions.fetchedLinks,
            loading: LinkActions.loading,
            error: LinkActions.fetchLinksError
        };
    }

};

const generatePayload = ucid => {
    var userState = UserStore.getState();
    var { token } = AuthStore.getState();
    var article = ArticleStore.getArticle(ucid);

    return {
        token: token,
        partner_id: userState.selectedInfluencer.id,
        ucid: ucid,
        site_id: article.site_id,
        client_id: article.publisher_id,
        url: article.url,
        source: 'contempo'
    };
};

const generateRequest = payload => {
    return API.post(`${Config.apiUrl}/links?token=${payload.token}`, payload)
        .then(function (payload) {
            var data = payload.data;
            data.shortlink = data.shortlink.replace('po.st', 'qklnk.co');
            return Promise.resolve(data);
        });
};

export default LinkSource;

import axios from 'axios';
import moment from 'moment';
import AuthStore from '../stores/Auth.store';
import UserStore from '../stores/User.store';
import ArticleStore from '../stores/Article.store';
import FilterStore from '../stores/Filter.store';
import LinkActions from '../actions/Link.action';
import Config from '../config';

const LinkSource = {

    generateLink() {
        return {
            remote(state, ucid) {
                return generateRequest(generatePayload(ucid));
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

                var payload = {
                    token: token,
                    influencerIds: JSON.stringify([userState.selectedInfluencer.id]),
                    siteIds: JSON.stringify(_.map(filters.sites, 'id')),
                    startDate: moment(filters.date_start).format(),
                    endDate: moment(filters.date_end).format()
                };

                return axios.get(`${Config.apiUrl}/links`, { params: payload })
                    .then(function (payload) {
                        var data = payload.data;
                        data = _.map(data, function (el) {
                            el.shortlink = el.shortlink.replace('po.st', 'qklnk.co');
                            return el;
                        });
                        return Promise.resolve(data);
                    });
            },

            success: LinkActions.fetchedLinks,
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
    return axios.post(`${Config.apiUrl}/links?token=${payload.token}`, payload)
        .then(function (payload) {
            var data = payload.data;
            data.shortlink = data.shortlink.replace('po.st', 'qklnk.co');
            return Promise.resolve(data);
        });
};

export default LinkSource;
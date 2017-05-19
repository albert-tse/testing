import moment from 'moment';
import { find, includes, map } from 'lodash';

import AuthStore from '../stores/Auth.store';
import UserStore from '../stores/User.store';
import ArticleStore from '../stores/Article.store';
import FilterStore from '../stores/Filter.store';
import ProfileSelectorStore from '../stores/ProfileSelector.store';
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

    /**
     * Fetch the influencer's saved links
     * @return {Promise}
     */
    fetchLinks() {
        return {
            remote(state) {
                const { token } = AuthStore.getState();
                const { selectedInfluencer, ...filters } = FilterStore.getState();

                if (selectedInfluencer.id >= 0) {
                    let params = {
                        token: token,
                        influencers: selectedInfluencer.id,
                        saved: 1,
                        sites: map(filters.sites, 'id').join(','),
                        startDate: moment(filters.linksDateRange.date_start).format(),
                        endDate: moment(filters.linksDateRange.date_end).format(),
                        limit: filters.linksPageSize,
                        offset: filters.linksPageNumber * filters.linksPageSize
                    };

                    return API.get(`${Config.apiUrl}/links/search`, { params }).then(function (payload) {
                        let links = payload.data.data;

                        links = map(links, function (link) {
                            return {
                                ...link,
                                shortUrl: link.shortUrl.replace('po.st', 'qklnk.co')
                            };
                        });

                        return Promise.resolve(links);
                    });
                } else {
                    return Promise.resolve([]);
                }
            },

            success: LinkActions.fetchedLinks,
            loading: LinkActions.loading,
            error: LinkActions.fetchLinksError
        };
    },

    xfetchLinks() {
        return {
            remote(state) {
                var { token } = AuthStore.getState();
                var userState = UserStore.getState();
                var filters = FilterStore.getState();

                const { selectedProfile } = ProfileSelectorStore.getState();

                if (!selectedProfile) {
                    return Promise.resolve([]);
                }

                const selectedInfluencer = find(filters.influencers, { id: selectedProfile.influencer_id }); // TODO: We should select one profile from geordi now

                if (!includes(filters.influencers, selectedInfluencer)) {
                    return Promise.resolve([]);
                }


                var payload = {
                    token: token,
                    influencers: selectedInfluencer.id,
                    sites: _.map(filters.sites, 'id').join(','),
                    startDate: moment(filters.linksDateRange.date_start).format(),
                    endDate: moment(filters.linksDateRange.date_end).format(),
                    limit: filters.linksPageSize,
                    offset: filters.linksPageNumber * filters.linksPageSize
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

            downloadLink(state) {
                var { token } = AuthStore.getState();
                var userState = UserStore.getState();
                var filters = FilterStore.getState();

                const { selectedProfile } = ProfileSelectorStore.getState();

                if (!selectedProfile) {
                    return Promise.resolve([]);
                }

                const selectedInfluencer = find(filters.influencers, { id: selectedProfile.influencer_id }); // TODO: We should select one profile from geordi now

                if (!includes(filters.influencers, selectedInfluencer)) {
                    return Promise.resolve([]);
                }

                var params = [
                    'token=' + token,
                    'influencers=' + selectedInfluencer.id,
                    'sites=' + _.map(filters.sites, 'id').join(','),
                    'startDate=' + moment(filters.linksDateRange.date_start).format(),
                    'endDate=' + moment(filters.linksDateRange.date_end).format(),
                    'limit=' + 1000000
                ];

                switch (filters.selectedLinkState) {
                    case 'posted':
                        params.push('posted=1');
                        break;
                    case 'scheduled':
                        params.push('scheduled=1');
                        break;
                    case 'saved':
                        params.push('saved=1');
                        break;
                }

                return `${Config.apiUrl}/links/search?type=csv&${params.join('&')}`;
            },

            success: LinkActions.fetchedLinks,
            loading: LinkActions.loading,
            error: LinkActions.fetchLinksError
        };
    }

};

const generatePayload = ucid => {
    var { token } = AuthStore.getState();
    var article = ArticleStore.getArticle(ucid);
    const { selectedProfile: { influencer_id } } = ProfileSelectorStore.getState();

    return {
        token: token,
        partner_id: influencer_id,
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

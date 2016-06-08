import axios from 'axios';
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
        .then(function(payload){
            var data = payload.data;
            data.shortlink = data.shortlink.replace('po.st', 'qklnk.co');
            return Promise.resolve(data);
        });
};

export default LinkSource;

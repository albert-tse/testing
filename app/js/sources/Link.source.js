import axios from 'axios';
import AuthStore from '../stores/Auth.store';
import UserStore from '../stores/User.store';
import ArticleStore from '../stores/Article.store';
import FilterStore from '../stores/Filter.store';
import LinkStore from '../stores/Link.store';
import LinkActions from '../actions/Link.action';
import Config from '../config';

const LinkSource = {

    generateLink() {
        return {
            remote(state, ucid) {
                var userState = UserStore.getState();
                var { token } = AuthStore.getState();
                var article = ArticleStore.getArticle(ucid);

                var payload = {
                    token: token,
                    partner_id: userState.selectedInfluencer.id,
                    ucid: ucid,
                    site_id: article.site_id,
                    client_id: article.publisher_id,
                    url: article.url,
                    source: 'contempo'
                };

                return axios.post(`${Config.apiUrl}/links?token=${token}`, payload)
                    .then(function(payload){
                        var data = payload.data;
                        data.shortlink = data.shortlink.replace('po.st', 'qklnk.co');
                        return Promise.resolve(data);
                    });
            },

            success: LinkActions.generatedLink,
            error: LinkActions.generatedLinkError
        }
    }

};

export default LinkSource;

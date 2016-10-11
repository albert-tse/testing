import alt from '../alt';
import ArticleActions from '../actions/Article.action';
import AuthStore from '../stores/Auth.store';
import Config from '../config';
import API from '../api.js';

var articleBatch = [];
var delayedPromise;
var delayedResolve;
var delayedReject;
var batchingDelay = 20;
var articleBatchTimeout = false;

var ArticleSource = {

    fetchArticles() {
        return {
            remote(state, articles) {
                articleBatch = _.concat(articleBatch, articles);

                var delayedAsync = function () {
                    //Set the timeout to false, so that all future calls go into a new batch. 
                    articleBatchTimeout = false;

                    //create local copies of the batch data
                    var ucids = _.clone(articleBatch);
                    var reject = delayedReject;
                    var resolve = delayedResolve;

                    //Reset the batch data so any new batches use new data
                    articleBatch = [];
                    delayedResolve = false;
                    delayedReject = false;

                    var ucidList = ucids.join();
                    var token = AuthStore.getState().token;
                    API.get(`${Config.apiUrl}/articles/?ucids=${ucidList}&token=${token}`)
                        .then(function (result) {
                            return result.data.data;
                        })
                        .then(resolve, reject);
                };

                if (articleBatchTimeout) {
                    clearTimeout(articleBatchTimeout);
                } else {
                    delayedPromise = new Promise(function (resolve, reject) {
                        delayedResolve = resolve;
                        delayedReject = reject;
                    });
                }

                articleBatchTimeout = setTimeout(delayedAsync, batchingDelay);

                return delayedPromise;
            },

            success: ArticleActions.loaded,
            loading: ArticleActions.loading,
            error: ArticleActions.error
        }
    },

    toggle() {
        return {
            remote(state, {ucid, markEnabled}) {
                const token = AuthStore.getState().token;
                return API.post(`${Config.apiUrl}/articles/mark-${markEnabled ? 'enabled' : 'disabled'}?ids=${ucid}&token=${token}`).then(response => {
                    if (response.statusText === 'OK') {
                        const article = state.articles[ucid];
                        return Object.assign({}, article, { enabled: article.enabled === 1 ? 0 : 1 });
                    } else {
                        return null;
                    }
                });
            },

            success: ArticleActions.toggled,
            error: ArticleActions.error
        };
    }
};

export default ArticleSource;

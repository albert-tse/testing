import alt from '../alt';

import ArticleAction from '../actions/Article.action';

class ArticleStore {

	constructor() {
		this.param = null;

		this.bindListeners({
			handleActionArticle: ArticleAction.ACTION_ARTICLE
		});
	}

	handleActionArticle(param) {
		this.param = param;
	}

}

export default alt.createStore(ArticleStore, 'ArticleStore');

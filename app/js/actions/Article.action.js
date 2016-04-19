import alt from '../alt';

class ArticleAction {

	actionArticle(param) {
		this.dispatch(param);
	}

}

export default alt.createActions(ArticleAction);

import alt from '../alt';

class FeedAction {

	actionFeed(param) {
		this.dispatch(param);
	}

}

export default alt.createActions(FeedAction);

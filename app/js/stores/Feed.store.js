import alt from '../alt';
import UserAction from '../actions/User.action';
import FeedSource from '../sources/Feed.source';

class FeedStore {

	constructor() {
		this.bindListeners({
            loadInitialArticles: UserAction.authorized
        });
	}

    loadInitialArticles(token) {
        console.log('FeedStore:loadInitialArticles');
        FeedSource.fetchAll(token).then( (response) => {
            this.setState(response.data);
        });
    }

}

export default alt.createStore(FeedStore, 'FeedStore');

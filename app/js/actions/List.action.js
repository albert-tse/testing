import alt from '../alt';

class ListActions {

    addToList(articles, list) {
        this.dispatch(articles, list);
        this.saveToList(articles, list);
    }

    removeFromList(articles, list) {
        this.dispatch(articles, list);
        this.removeFromList(articles, list);
    }

    load(list) {
        this.dispatch(articles);
        this.fetchList(articles);
    }

    loading(list) {
        this.dispatch(articles);
    }

    loaded(list) {
        this.dispatch(articles);
    }

    error(list, error) {
        this.dispatch(list, error);
    }
}

export default alt.createActions(ListActions);

import ListStore from '../stores/List.store';

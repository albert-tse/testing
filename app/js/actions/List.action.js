import alt from '../alt';

class ListActions {

    addToList(articles, list) {
        this.dispatch(articles, list);
        ListStore.saveToList(articles, list);
    }

    removeFromList(articles, list) {
        this.dispatch(articles, list);
        ListStore.removeFromList(articles, list);
    }

    load(list) {
        this.dispatch(list);
        ListStore.fetchList(list);
    }

    loading(list) {
        this.dispatch(list);
    }

    loaded(list) {
        this.dispatch(list);
    }

    error(list, error) {
        this.dispatch(list, error);
    }
}

export default alt.createActions(ListActions);

import ListStore from '../stores/List.store';

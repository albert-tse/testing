import alt from '../alt';

class ListActions {
    addToSavedList(articles){
        var savedList = ListStore.getSavedList();
        if(savedList.isLoading){
            ListStore.loadSavedList()
                .then(function(){
                    savedList = ListStore.getSavedList();
                    ListStore.addToList(articles, savedList.list_id);
                });
        } else {
            ListStore.addToList(articles, savedList.list_id);
        }
    }

    addToList(articles, list) {
        this.dispatch(articles, list);
        ListStore.addToList(articles, list);
    }

    removeFromSavedList(articles, list) {
        var savedList = ListStore.getSavedList();
        if(savedList.isLoading){
            ListStore.loadSavedList()
                .then(function(){
                    savedList = ListStore.getSavedList();
                    ListStore.removeFromList(articles, savedList.list_id);
                });
        } else {
            ListStore.removeFromList(articles, savedList.list_id);
        }
    }

    removeFromList(articles, list) {
        this.dispatch(articles, list);
        ListStore.removeFromList(articles, list);
    }

    getSavedList() {
        this.dispatch();
        ListStore.loadSavedList();
    }

    load(list) {
        this.dispatch(list);
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

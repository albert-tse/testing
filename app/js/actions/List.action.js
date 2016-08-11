import alt from '../alt';

class ListActions {
    addToSavedList(articles){
        var savedList = ListStore.getSavedList();
        if(savedList.isLoading){
            ListStore.loadSavedList()
                .then(function(){
                    savedList = ListStore.getSavedList();
                    if(savedList.list_id){
                        ListStore.addToList(articles, savedList.list_id);
                    } else {
                        ListStore.createList('saved',1).then(function(){
                            savedList = ListStore.getSavedList();
                            ListStore.addToList(articles, savedList.list_id);
                        });
                    }
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

    clearSavedList() {
        this.dispatch();
    }

    getSavedList() {
        this.dispatch();
        ListStore.loadSavedList();
    }

    getRelatedToList(ucid) {
        this.dispatch();
        ListStore.getRelatedArticlesList(ucid);
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
        console.error('ListActions.error', list, error);
        this.dispatch(list, error);
    }

}

export default alt.createActions(ListActions);

import ListStore from '../stores/List.store';

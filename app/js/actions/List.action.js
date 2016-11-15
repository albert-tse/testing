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
        ListStore.addToList(articles, list).then(function(){
            NotificationStore.add('Article(s) added to list');
        });
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

    load(lists) {
        this.dispatch(lists);
        ListStore.loadLists(lists);
    }

    loadSpecialList(listName) {
        this.dispatch(listName);
        ListStore.loadSpecialList(listName);
    }

    loading(list) {
        this.dispatch(list);
    }

    loaded(list) {
        this.dispatch(list);

        if (list.added) {
            // Send the list of UCIDs that were added to the user's saved list in order to display notifications for those articles
            ListStore.notifySavedArticles(list.added);
        }
    }

    error(list, error) {
        this.dispatch(list, error);
    }

    loadMyLists() {
        this.dispatch();
        ListStore.getUserLists();
    }

    myListsLoading() {
        this.dispatch();
    }

    myListsLoaded(lists) {
        this.dispatch(lists);
    }

    myListsError(error) {
        this.dispatch(error);
    }

    createList(name) {
        this.dispatch(name);
        ListStore.createList(name,2).then(function(){
            ListStore.getUserLists().then(function(){
                NotificationStore.add('List Created');
            });
        });
    }
}

export default alt.createActions(ListActions);

import ListStore from '../stores/List.store';
import NotificationStore from '../stores/Notification.store';

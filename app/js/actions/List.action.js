import alt from '../alt';
import FilterStore from '../stores/Filter.store';
import FilterActions from './Filter.action';
import History from '../history';
import Config from '../config';

import moment from 'moment';

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

    addToList({ articles, list }) {
        if (_.isEqual(articles, [-1])) {
            articles = FilterStore.getState().ucids
            FilterActions.clearSelection()
        }

        this.dispatch(articles, list);
        ListStore.addToList(articles, list)
            .then(() => NotificationStore.add({
                    action: 'Go to List',
                    label: 'Article(s) added to list',
                    callback: evt => redirectTo(list, true),
                }))
            .then(() => ListStore.getUserLists())
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
        return ListStore.createList(name,2)
            .then(response => {
                return ListStore.getUserLists()
            })
    }

    createAndSaveToList(payload) {
        this.dispatch()
        ListStore.createAndSaveToList(payload.listName, 2, payload.articles)
    }

    clearStories(listId) {
        this.dispatch(listId);
        ListStore.removeAllFromList(listId);
    }

    renameList(listId, listName) {
        this.dispatch(listId, listName);
        ListStore.renameList(listId, listName);
    }

    deleteList(listId) {
        this.dispatch(listId);
        ListStore.deleteList(listId)
        History.push(Config.routes.explore)
    }

    deletedList(lists) {
        this.dispatch()
        ListStore.getUserLists()
    }

    shareList(payload) {
        ListStore.shareList(payload);
    }

    sharedList(responses) {
        this.dispatch(responses);
    }
}

const redirectTo = (listId, allTime) => {
    const url = Config.routes.list.replace(':listId', listId);
    FilterActions.clearSelection();
    FilterActions.reset();

    if(allTime) {
        FilterActions.update({
            exploreDateRange: {
                date_range_type: 'allTime',
                date_start: moment(0).format(),
                date_end: moment().startOf('day').add(1, 'days').format()
            }
        });
    }
    History.push(url);
};

export default alt.createActions(ListActions);

import ListStore from '../stores/List.store';
import NotificationStore from '../stores/Notification.store';

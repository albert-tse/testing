import alt from '../alt'
import ListActions from '../actions/List.action'
import ListSource from '../sources/List.source'
import Config from '../config/'
import History from '../history'
import _ from 'lodash';

var BaseState = {
    lists: {},
    specialLists: {
        saved: false,
        recentlySavedQueue: []
    },
};

var listIsLoadingObject = {
    isLoading: true
};



class ListStore {

    // static config = {}
    constructor() {
        _.assign(this, BaseState);

        this.registerAsync(ListSource);

        this.bindListeners({
            handleLoad: ListActions.LOAD,
            handleLoading: ListActions.LOADING,
            handleLoaded: ListActions.LOADED,
            handleError: ListActions.ERROR,
            handleClearSavedList: ListActions.CLEAR_SAVED_LIST
        });

        this.exportPublicMethods({
            getSavedList: ::this.getSavedList,
            getRelatedToList: ::this.getRelatedToList,
            getList: ::this.getList,
            isSaved: ::this.isSaved,
            isRecentlySaved: ::this.isRecentlySaved,
            notifySavedArticles: ::this.notifySavedArticles
        });
    }

    handleLoad(lists) {}

    handleLoading(lists) {}

    /**
     * Handle the response from server when fetching a specific list by name
     * @param Object response containing status of request, first page of articles, and metadata of search response
     */
    handleLoaded(lists) {
        var thisInst = this;
        _.forEach(lists, function (list) {
            thisInst.lists[list.list_id] = list;
            list.isLoading = false;

            //If it is a special list, save the id
            if (list.list_type_id == 1) {
                thisInst.specialLists.saved = list.list_id;
            }
        });

        this.setState(this);
    }

    handleError(error) {

    }

    handleClearSavedList() {
        const savedList = this.getInstance().getSavedList();
        if ('articles' in savedList && savedList.articles.length > 0) {
            let savedArticles = savedList.articles.map(article => article.ucid);
            _.defer(this.getInstance().removeFromList, savedArticles, savedList.list_id);
        }
    }

    //TODO rather than get "Saved" this should be get "Special List" where we have a list a special lists, that are predetermined. 
    getSavedList() {
        var savedListId = this.specialLists.saved;
        if (savedListId) {
            return this.getInstance().getList(savedListId);
        } else {
            return _.assign({}, listIsLoadingObject);
        }

    }

    getRelatedToList(ucid) {
        var relatedListId = _.has(this.lists, 'related_to_'+ucid);
        if (relatedListId) {
            return this.getInstance().getList('related_to_'+ucid);
        } else {
            return _.assign({}, listIsLoadingObject);
        }
    }

    getList(id) {
        if (this.lists[id]) {
            return this.lists[id];
        } else {
            var loading = _.assign({}, listIsLoadingObject);
            loading.list_id = id;
            return loading;
        }
    }

    isSaved(ucid) {
        if(this.specialLists.saved === false ){
            this.specialLists.saved = -1;
            _.defer(this.getInstance().loadSavedList);
        }
        return typeof _.find(this.getSavedList().articles, { ucid: parseInt(ucid) }) !== 'undefined';
    }

    isRecentlySaved(ucid) {

        // If the recently saved article queue is empty, just return false
        if (this.specialLists.recentlySavedQueue.length === 0) {
            return false;
        }

        // Check the recently saved article queue. The queue is an array of arrays, where each inner array contains a list of UCIDs that were saved in that batch
        return typeof _.find(this.specialLists.recentlySavedQueue, (recentlySaved) => {
            return typeof _.find(recentlySaved, (u) => {
                    return u.toString() == ucid.toString()
                }) !== 'undefined';
        }) !== 'undefined';
    }

    notifySavedArticles(ucids) {
        // After a new batch of UCIDs have been added to the user's saved list, we want to display notifications to the user that the save was successful
        var newQueue = [...this.specialLists.recentlySavedQueue, ucids];

        // We'll append the array of saved UCIDs to our recently saved queue
        this.setState({
            specialLists: {
                saved: this.specialLists.saved,
                recentlySavedQueue: newQueue
            }
        });

        // After 3 seconds, we'll remove the notifications for this batch of UCIDs
        return _.delay(::this.tickSavedNotification, 3000);
    }

    tickSavedNotification() {
        // Remove the first array of UCIDs from the recently saved article queue.
        this.specialLists.recentlySavedQueue.shift();
        
        this.setState({
            specialLists: {
                saved: this.specialLists.saved,
                recentlySavedQueue: this.specialLists.recentlySavedQueue
            }
        });
    }

}

export default alt.createStore(ListStore, 'ListStore');

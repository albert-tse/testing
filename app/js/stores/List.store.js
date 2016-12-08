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
        recommended: false,
        curatedExternal: false,
        curatedInternal: false,
        recentlySavedQueue: []
    },
    userLists: 'unloaded'
};

var listIsLoadingObject = {
    isLoading: true,
    articles: -1
};

class ListStore {

    // static config = {}
    constructor() {
        _.assign(this, BaseState);

        this.registerAsync(ListSource);

        this.bindListeners({
            handleLoad: ListActions.LOAD,
            handleLoading: ListActions.LOADING,
            handleLoaded: [ListActions.LOADED, ListActions.MY_LISTS_LOADED],
            handleError: ListActions.ERROR,
            handleClearSavedList: ListActions.CLEAR_SAVED_LIST,
            handleUserListLoading: ListActions.MY_LISTS_LOADING,
            handleUserListLoaded: ListActions.MY_LISTS_LOADED,
            handleUserListError: ListActions.MY_LISTS_ERROR
        });

        this.exportPublicMethods({
            getSavedList: ::this.getSavedList,
            getSpecialList: ::this.getSpecialList,
            getRelatedToList: ::this.getRelatedToList,
            getList: ::this.getList,
            isSaved: ::this.isSaved,
            isRecentlySaved: ::this.isRecentlySaved,
            notifySavedArticles: ::this.notifySavedArticles,
            getName: ::this.getName
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
            } else if(list.list_id == 'recommended' && list.list_type_id == 0){
                thisInst.specialLists.recommended = list.list_id;
            } else if(list.list_type_id == 3){
                thisInst.specialLists.curatedExternal = list.list_id;
            } else if(list.list_type_id == 4){
                thisInst.specialLists.curatedInternal = list.list_id;
            }

            //Scan the user lists, and if this list is a user list, update the userlist reference
            _.forEach(thisInst.userLists, function(ul){
                if(ul.list_id == list.list_id){
                    ul.articles = list.articles.length;
                }
            });
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

    getSavedList() {
        var savedListId = this.specialLists.saved;
        if (savedListId) {
            return this.getInstance().getList(savedListId);
        } else {
            return _.assign({}, listIsLoadingObject);
        }
    }

    getSpecialList(listName) {
        var listId = false;

        if(listName == 'saved'){
            listId = this.specialLists.saved;
        }else if(listName == 'recommended'){
            listId = this.specialLists.recommended;
        }else if(listName == 'curated-external'){
            listId = this.specialLists.curatedExternal;
        }else if(listName == 'curated-internal'){
            listId = this.specialLists.curatedInternal;
        }

        if (listId) {
            return this.getInstance().getList(listId);
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
            this.specialLists.saved = 0;
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

        this.specialLists.recentlySavedQueue = newQueue;

        // We'll append the array of saved UCIDs to our recently saved queue
        this.setState(this);

        // After 3 seconds, we'll remove the notifications for this batch of UCIDs
        return _.delay(::this.tickSavedNotification, 3000);
    }

    getName(listId) {
        if (Array.isArray(this.userLists)) {
            const list = this.userLists.filter(list => list.list_id === listId);
            return list.length > 0 ? list[0].list_name : 'Back';
        } else {
            return 'Back';
        }
    }

    tickSavedNotification() {
        // Remove the first array of UCIDs from the recently saved article queue.
        this.specialLists.recentlySavedQueue.shift();
        
        this.setState(this);
    }

    handleUserListLoading() {
        if(this.userLists === 'unloaded'){
            this.setState({
                userLists: 'loading'
            });
        }
    }

    handleUserListLoaded(lists) {
        this.setState({
            userLists: _.map(lists, function(el){
                return _.extend({}, el, {articles: el.articles.length});
            })
        });
    }
    
    handleUserListError(error) {
        if(this.userLists === 'loading'){
            this.setState({
                userLists: 'unloaded'
            });
        }
    }
}

export default alt.createStore(ListStore, 'ListStore');

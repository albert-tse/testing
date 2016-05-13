import alt from '../alt'
import ListActions from '../actions/List.action'
import ListSource from '../sources/List.source'
import Config from '../config/'
import History from '../history'

var BaseState = {
    lists: {},
    specialLists: {
        saved: false
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
        });

        this.exportPublicMethods({
            getSavedList: ::this.getSavedList,
            getList: ::this.getList
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

    //TODO rather than get "Saved" this should be get "Special List" where we have a list a special lists, that are predetermined. 
    getSavedList() {
        var savedListId = this.specialLists.saved;
        if (savedListId) {
            return this.getInstance().getList(savedListId);
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

}

export default alt.createStore(ListStore, 'ListStore');

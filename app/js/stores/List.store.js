import alt from '../alt'
import ListActions from '../actions/List.action'
import ListSource from '../sources/List.source'
import Config from '../config/'
import History from '../history'

var BaseState = {}

class ListStore {

    // static config = {}

    constructor() {
        _.assign(this, BaseState);

        // XXX: This should go to BaseState? just put it here to avoid merge conflict
        this.lists = {
        };

        this.registerAsync(ListSource);

        this.bindActions(ListActions);
        // this.bindListeners({});

        this.exportPublicMethods({});
    }

    handleLoad(articles) {

    }

    handleLoading(articles) {

    }

    handleLoaded(articles) {

    }

    handleError(data) {

    }

    /**
     * Handle the response from server when fetching a specific list by name
     * @param Object response containing status of request, first page of articles, and metadata of search response
     */
    onFetchedList(response) {
        var articles = response.data.hits.hit;
        articles = _.map(articles, 'fields').map(function (article) {
            return _.extend(article, {
                category: flattenProperty(article, 'category'),
                clientId: flattenProperty(article, 'client_id'),
                creationDate: flattenProperty(article, 'creation_date'),
                description: flattenProperty(article, 'description'),
                enabled: flattenProperty(article, 'enabled'),
                image: flattenProperty(article, 'image'),
                linkType: flattenProperty(article, 'link_type'),
                siteId: flattenProperty(article, 'site_id'),
                title: flattenProperty(article, 'title'),
                ucid: flattenProperty(article, 'ucid'),
                url: flattenProperty(article, 'url'),
            });
        });

        console.log('I received a response from the server with', articles);
        console.log(this);
        this.lists[response.listName] = articles;
    }

}

/**
 * Temporarily digest the article object that contains properties that are array but should be a string instead
 * @param String propertyName of property to flatten
 */
function flattenProperty(object, property) {
    return property in object && Array.isArray(object[property]) ? 
        object[property].join('') : 
        object[property];
};

export default alt.createStore(ListStore, 'ListStore');

import alt from '../alt'
import ListActions from '../actions/List.action'
import ListSource from '../sources/List.source'
import Config from '../config/'
import History from '../history'

var BaseState = {}

class ListStore {

    static config = {}

    constructor() {
        _.assign(this, BaseState);

        this.registerAsync(ListSource);

        this.bindListeners({});

        this.exportPublicMethods({});
    }

    handleLoad(articles) {

    }

    handleLoading(articles) {

    }

    handleLoaded(articles) {
        console.log(articles);
    }

    handleError(data) {

    }


}

export default alt.createStore(AuthStore, 'ListStore');

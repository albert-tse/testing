import alt from '../alt';
import ArticleStore from './Article.store';
import ArticleActions from '../actions/Article.action';

const BaseState = {
    title: 'Explore',
    selectedArticles: []
};

class ExploreAppBarStore {

    constructor() {
        Object.assign(this, BaseState);
        this.bindActions(ArticleActions);
    }

    onSelected(payload) {
        var { detail: ucid } = payload;
        this.setState({
            selectedArticles: [ ...this.selectedArticles, ucid ]
        });
    }

    onDeselected(payload) {
        var { detail: deselectedUcid } = payload;
        this.setState({
            selectedArticles: this.selectedArticles.filter(ucid => ucid !== deselectedUcid)
        });
    }
}

export default alt.createStore(ExploreAppBarStore, 'ExploreAppBarStore');

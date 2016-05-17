import alt from '../alt';
import ArticleStore from './Article.store';
import ArticleActions from '../actions/Article.action';
import AppBarActions from '../actions/AppBar.action';

const BaseState = {
    title: 'Explore',
    selectedArticles: [],
};

class ExploreAppBarStore {

    constructor() {
        Object.assign(this, BaseState);
        this.bindActions(ArticleActions);
        this.bindActions(AppBarActions);
        this.exportPublicMethods({
            clearSelection: ::this.clearSelection
        });
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

    onPageChanged(pageName) {
        this.setState({
            title: pageName,
            selectedArticles: []
        });
    }

    clearSelection() {

        // XXX: How should this be done instead of using DOM?
        [].forEach.call(document.querySelectorAll('.grid-item.selected'), function (article) {
            article.classList.remove('selected');
        });

        this.setState({
            selectedArticles: []
        });
    }
}

export default alt.createStore(ExploreAppBarStore, 'ExploreAppBarStore');

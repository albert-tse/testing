import React from 'react'
import AltContainer from 'alt-container'
import Component from './Article.component'
import { Buttons } from './Article.component'
import ArticleStore from '../../../stores/Article.store'
import ArticleActions from '../../../actions/Article.action'
import ListStore from '../../../stores/List.store'
import ListActions from '../../../actions/List.action'

class Article extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        var thisi = this;
        var isArticleSaved = _.find(ListStore.getSavedList().articles, function(el){
            return el.ucid == thisi.props.article.ucid;
        }) != undefined;

        return (
            <AltContainer
                stores={{
                    data: props => ({
                        store: ArticleStore,
                        value: ArticleStore.getArticle(this.props.article.ucid)
                    }),
                    isSaved: props => ({
                        store: ListStore,
                        value: ListStore.isSaved(this.props.article.ucid)
                    })
                }}
                actions={ ArticleActions }
                component={ Component }
            />
        );
    }

}

export default Article;
/*
inject={{
buttons: [{
    type: Buttons.MORE
}, {
        type: Buttons.SHARE,
        action: ArticleActions.share
    }],
    saveButton: {
        show: true,
        isSaved: isArticleSaved,
        onSave: function(ucid){
            ListActions.addToSavedList([ucid]);
        },
        onRemove: function(ucid){
            ListActions.removeFromSavedList([ucid]);
        }
    }
}
*/

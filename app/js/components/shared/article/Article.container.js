import React from 'react'
import AltContainer from 'alt-container'
import Component from './Article.component'
import { Buttons } from './Article.component'
import ArticleStore from '../../../stores/Article.store'
import ArticleActions from '../../../actions/Article.action'

class Article extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        var thisi = this;

        // XXX: We can also inject a prop that specifies which components to show on this page
        return (
            <AltContainer
                stores={{
                    data: props => ({
                        store: ArticleStore,
                        value: ArticleStore.getArticle(this.props.article.ucid)
                    })
                }}
                actions={ ArticleActions }
                component={ Component }
            />
        );
    }

}

export default Article;

import React from 'react'
import AltContainer from 'alt-container'
import Component from './Article.component'
import { Buttons } from './Article.component'
import ArticleStore from '../../../stores/Article.store'
import ArticleActions from '../../../actions/Article.action'
import FilterStore from '../../../stores/Filter.store';

class Article extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        var thisi = this;

        // XXX: We can also inject a prop that specifies which components to show on this page
        // TODO: Find out when this article should update
        return (
            <AltContainer
                shouldComponentUpdate={(props, container, nextProps) => props.isSelected !== nextProps.isSelected} 
                stores={{
                    data: props => ({
                        store: ArticleStore,
                        value: ArticleStore.getArticle(this.props.article.ucid)
                    }),
                    isSelected: props => ({
                        store: FilterStore,
                        value: FilterStore.getState().ucids.indexOf(this.props.article.ucid) >= 0
                    })
                }}
                actions={ ArticleActions }
                component={ Component }
            />
        );
    }

}

export default Article;

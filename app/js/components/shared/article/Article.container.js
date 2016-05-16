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

    componentDidMount() {
        //TODO, this is a hack. Figure out the proper way to do this
        var ucid = this.props.article.ucid;
        setTimeout(function () {
            ArticleActions.load([ucid]);
        }, 1);
    }

    render() {
        return <AltContainer listName = "saved"
        stores = {
            {
                data: (props) => {
                    return {
                        store: ArticleStore,
                        value: ArticleStore.getArticle(this.props.article.ucid)
                    };
                }
            }
        }
        actions = { ArticleActions }
        component = { Component }
        inject = {
            {
                buttons: [{
                    type: Buttons.MORE
                }, {
                    type: Buttons.SHARE,
                    action: ArticleActions.share
                }]
            }
        }
        />;
    }

}

export default Article;

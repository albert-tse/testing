import React from 'react'
import AltContainer from 'alt-container'
import Component from './ArticleModal.component'
import ArticleStore from '../../../stores/Article.store'
import ArticleActions from '../../../actions/Article.action'

class ArticleModal extends React.Component {

    constructor(props) {
        super(props);
    }
    
    render() {

        if (this.props.article == null) {
            return null;
        }

        return (
            <AltContainer
                stores={{
                    article: props => ({
                        store: ArticleStore,
                        value: ArticleStore.getArticle(this.props.article.ucid)
                    })
                }}
                actions={ ArticleActions }
                component={ Component }
                inject={{
                    hide: () => this.props.hide,
                    visible: this.props.visible
                }}
            />
        );
    }

}

export default ArticleModal;
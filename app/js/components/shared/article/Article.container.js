import React from 'react'
import AltContainer from 'alt-container'
import Component from './Article.component'
import { Buttons } from './Article.component'
import ArticleStore from '../../../stores/Article.store'
import ArticleActions from '../../../actions/Article.action'
import FilterStore from '../../../stores/Filter.store'
import UserStore from '../../../stores/User.store'

class Article extends React.Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }
    
    render() {
        return (
            <AltContainer
                component={ Component }
                shouldComponentUpdate={ (prevProps, container, nextProps) => prevProps.data !== nextProps.data || prevProps.isSelected !== nextProps.isSelected || prevProps.influencer !== nextProps.influencer }
                actions={ ArticleActions }
                stores={{
                    data: props => ({
                        store: ArticleStore,
                        value: ArticleStore.getArticle(this.props.article.ucid)
                    }),
                    isSelected: props => ({
                        store: FilterStore,
                        value: FilterStore.getState().ucids.indexOf(this.props.article.ucid) >= 0
                    }),
                    influencer: props => ({
                        store: UserStore,
                        value: UserStore.getState().selectedInfluencer
                    })
                }}
                inject={{
                    showInfo: () => this.props.showInfo
                }}
            />
        );
    }

}

export default Article;

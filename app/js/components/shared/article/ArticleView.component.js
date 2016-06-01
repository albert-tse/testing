import React, { Component } from 'react';
import Article from './Article.container';
import Styles from './styles';

export default class ArticleView extends Component {

    constructor(props) {
        super(props);
    }

    /**
     * We only want to update when new articles come in, so we don't have to quickly unmount and mount new ones
     * @param Object nextProps contains the articles that will may be loaded
     * @return Boolean false if it's going to try to remove articles from the view 
     * TODO: there must be some way to override this when we have to just clear the view without quickly mounting any new articles
     */
    shouldComponentUpdate(nextProps) {
        return !this.props.preventUpdate && nextProps.articles.length > 0;
    }

    render() {
        return (
            <div className={Styles.container}>
                { this.hasArticles() && this.renderArticles() }
            </div>
        );
    }

    hasArticles() {
        return this.props.articles.length > 0;
    }

    renderArticles() {
        return this.props.articles.map((article, index) => (
            <Article key={index} article={article} />
        ));
    }
}

ArticleView.defaultProps = {
    articles: []
};

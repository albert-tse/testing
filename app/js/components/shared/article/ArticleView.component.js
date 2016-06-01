import React, { Component } from 'react';
import Article from './Article.container';
import Styles from './styles';

export default class ArticleView extends Component {

    constructor(props) {
        super(props);
    }

    /**
     * Allow this component to not remove elements from the DOM
     * @param Object nextProps contains the articles that will may be loaded
     * @return Boolean false if it's going to try to remove articles from the view 
     */
    shouldComponentUpdate(nextProps) {
        return !this.props.preventUpdate || this.props.articles.length < nextProps.articles.length;
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

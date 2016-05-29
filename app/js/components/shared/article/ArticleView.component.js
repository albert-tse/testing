import React, { Component } from 'react';
import Article from './Article.container';
import Styles from './styles';

export default class ArticleView extends Component {

    constructor(props) {
        super(props);
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

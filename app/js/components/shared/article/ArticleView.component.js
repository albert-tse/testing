import React, { Component } from 'react';
import Article from './Article.container';


export default class ArticleView extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var id = 'articles-container';
        var className = 'container';

        return (
            <div id={id} className={className}>
                { ! this.hasArticles() ? 'No articles are saved' : this.renderArticles() }
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

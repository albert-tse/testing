import React from 'react';
import Article from './Article.container';


export default class ArticleView extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        if (typeof this.props.articles !== 'undefined' && this.props.articles.length > 0) {
            return (
                <div>
                    I will display articles here
                </div>
            );
        }

        return <div />
    }
}

    /*
    render() {
        if (this.props.list.isLoading) {
            return (
                <div id="articles-container" className="container">
                    <div className="row">
                        Loading....
                    </div>
                </div>
            );
        } else {
            return (
                <div id="articles-container" className="container">
                    <div className="row">
                        { _.map(this.props.list.articles, ::this.renderArticle)}
                    </div>
                </div>
            );
        }
    }

    renderArticle(article, index) {
        return (<Article key = { index } article={ article } />);
    }
    */

import React from 'react';
import Article from './Article.container';


export default class ArticleView extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        var id = 'articles-container';
        var className = 'container';

        if (typeof this.props.articles !== 'undefined' && this.props.articles.length > 0) {
            return (
                <div id={id} className={className}>
                    {this.props.articles.map((article, index) => (
                        <Article key={index} article={article} />
                    ))}
                </div>
            );
        }

        return <div id={id} className={className} />
    }
}

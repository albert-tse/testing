import React from 'react';
import Article from '../shared/Article.component';


class Saved extends React.Component {

    constructor(props) {
        super(props);
        console.log('Saved props are: ', this.props);
    }

    render() {
        return (
        <div className="container-fluid row">
            <div id="articles-container">
                {this.props.articles.map(this.renderArticle)}
            </div>
        </div>
        );
    }

    renderArticle(article, index) {
        return <Article key={index} data={article} />;
    }
    
}

export default Saved;

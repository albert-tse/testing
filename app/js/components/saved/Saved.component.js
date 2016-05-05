import React from 'react';
import { Header, Toolbar } from '../shared';
import Article from '../shared/Article.component';


class Saved extends React.Component {

    constructor(props) {
        super(props);
        console.log('Saved props are: ', this.props);
    }

    render() {
        return (
        <div id="saved" className="tab-content">
            <Header />
            <Toolbar />
            <div id="articles-container" className="container-fluid row">
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

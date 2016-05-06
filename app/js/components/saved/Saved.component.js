import React from 'react';
import { Header } from '../shared';
import { Article, Buttons } from '../shared/Article.component';


class Saved extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="saved-tab" className="tab-content">
                <Header />
                <div id="articles-container" className="container-fluid row">
                    {this.props.articles.map(::this.renderArticle)}
                </div>
            </div>
        );
    }

    renderArticle(article, index) {
        return (
            <Article key={index} data={article} actions={[ Buttons.RELATED, Buttons.SHARE ]} />
        );
    }
}

export default Saved;
